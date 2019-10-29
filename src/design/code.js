import { getComponentType } from '../utils';

const router = firstPath => `
const RouterContext = React.createContext({})

const Router = ({ children }) => {
  const [path, setPath] = React.useState("${firstPath}")

  React.useEffect(() => {
    const onPopState = () => setPath(document.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const push = nextPath => {
    if (nextPath !== path) {
      window.history.pushState(undefined, undefined, nextPath)
      setPath(nextPath)
      window.scrollTo(0, 0)
    }
  }

  return (
    <RouterContext.Provider value={{ path, push }}>
      {children}
    </RouterContext.Provider>
  )
}

const Routes = ({ children }) => {
  const { path: contextPath } = React.useContext(RouterContext)
  let found
  Children.forEach(children, child => {
    if (!found && contextPath === child.props.path) found = child
  })
  return found
}

const Route = ({ Component, path }) => {
  const { path: contextPath } = React.useContext(RouterContext)
  return contextPath === path ? <Component /> : null
}
`;

const screenComponentName = ({ id, name }) =>
  name
    ? `${name.charAt(0).toUpperCase()}${name.replace(' ', '').slice(1)}`
    : `Screen${id}`;

export const generateJSX = (design, libraries, themeArg) => {
  const imports = { Grommet: true };
  const iconImports = {};
  const themeImports = {};
  const screenNames = {};
  let layers = {};
  let theme = design.theme;
  let publishedTheme;

  const componentToJSX = ({ screen, id, indent = '  ' }) => {
    let result;
    const component = design.components[id];
    const type = getComponentType(libraries, component.type);
    if (component.type === 'designer.Icon' || component.type === 'Icon') {
      const { icon, ...rest } = component.props;
      iconImports[icon] = true;
      result = `${indent}<${icon} ${Object.keys(rest)
        .map(k => `${k}="${rest[k]}"`)
        .join(' ')} />`;
    } else if (
      component.type === 'designer.Repeater' ||
      component.type === 'Repeater'
    ) {
      const childId = component.children && component.children[0];
      result = childId
        ? (
            componentToJSX({ screen, id: childId, indent: `${indent}  ` }) +
            '\n'
          ).repeat(component.props.count)
        : '';
    } else if (
      component.type === 'designer.Reference' ||
      component.type === 'Reference'
    ) {
      result = componentToJSX({
        screen,
        id: component.props.component,
        indent,
      });
    } else {
      if (component.type === 'grommet.Layer') {
        layers[id] = true;
      }
      imports[type.name] = true;

      let children =
        (component.children &&
          component.children
            .map(cId =>
              componentToJSX({ screen, id: cId, indent: `${indent}  ` }),
            )
            .join('\n')) ||
        (component.text && `${indent}  ${component.text}`);
      if (children && children.length === 0) children = undefined;

      let nav;
      if (component.designProps && component.designProps.link) {
        const link = component.designProps.link;
        if (link.component) {
          if (design.components[link.component]) {
            nav = `setLayer(layer ? undefined : ${link.component})`;
          }
        } else {
          const screen = design.screens[link.screen];
          if (screen) nav = `push("${screen.path}")`;
        }
      }

      result = `${indent}<${type.name}${Object.keys(component.props)
        .filter(name => {
          const value = component.props[name];
          return !(
            (typeof value === 'object' && Object.keys(value).length === 0) ||
            value === '' ||
            value === undefined
          );
        })
        .map(name => {
          const value = component.props[name];
          // TODO: handle -component- props
          if (
            component.type === 'grommet.DropButton' &&
            name === 'dropContent'
          ) {
            return `  dropContent={(\n${componentToJSX({
              screen,
              id: value,
              indent: `${indent}  `,
            })}\n${indent})}\n${indent}`;
          }
          if (typeof value === 'string') {
            if (name === 'icon') {
              iconImports[value] = true;
              return ` ${name}={<${value} />}`;
            }
            return ` ${name}="${value}"`;
          }
          return ` ${name}={${JSON.stringify(value)}}`;
        })
        .join('')}${nav ? ` onClick={() => ${nav}}` : ''}${
        component.type === 'Grommet' && theme ? ` theme={${theme}}` : ''
      }${children ? '' : ' /'}>${
        children ? `\n${children}\n${indent}</${type.name}>` : ''
      }`;
    }
    // TODO: library
    if (component.type === 'grommet.Layer') {
      result = `${indent}{layer === ${component.id} && (
${result}
      )}`;
    }
    return result;
  };

  if (design.theme) {
    if (design.theme.startsWith('https:')) {
      publishedTheme = `const theme = ${JSON.stringify(themeArg, null, 2)}`;
      theme = 'theme';
    } else {
      if (design.theme === 'grommet' || design.theme === 'dark') {
        imports[design.theme] = true;
      } else {
        themeImports[design.theme] = true;
      }
    }
  }

  Object.keys(design.screens).forEach(sId => {
    const screen = design.screens[sId];
    screenNames[sId] = screenComponentName(screen);
  });

  const single = Object.keys(design.screens).length === 1;
  const screens = Object.keys(design.screens)
    .map(sKey => design.screens[sKey])
    .map(screen => {
      layers = {};
      const root = componentToJSX({
        screen,
        id: screen.root,
        indent: single ? '      ' : '    ',
      });
      return `${
        single ? 'export default' : `const ${screenComponentName(screen)} =`
      } () => {
  ${!single ? 'const { push } = React.useContext(RouterContext)\n  ' : ''}${
        Object.keys(layers).length > 0
          ? 'const [layer, setLayer] = React.useState()'
          : ''
      }
  return (${single ? `\n    <Grommet theme={${theme}}>` : ''}
${root}
${single ? '    </Grommet>\n' : ''}  )
}`;
    })
    .join('\n\n');

  return `import React${!single ? ', { Children }' : ''} from 'react'
import { ${Object.keys(imports).join(', ')} } from 'grommet'
${
  Object.keys(iconImports).length > 0
    ? `import { ${Object.keys(iconImports).join(', ')} } from 'grommet-icons'`
    : ''
}${Object.keys(themeImports)
    .map(theme => `import { ${theme} } from 'grommet-theme-${theme}'`)
    .join('\n')}
${!single ? router(design.screens[design.screenOrder[0]].path) : ''}
${publishedTheme || ''}
${screens}
${
  !single
    ? `
export default () => (
  <Grommet full theme={${theme}}>
    <Router>
      <Routes>
        ${Object.keys(design.screens)
          .map(id => design.screens[id])
          .map(
            screen =>
              `<Route path="${screen.path}" Component={${screenComponentName(
                screen,
              )}} />`,
          )
          .join('\n        ')}
      </Routes>
    </Router>
  </Grommet>
)
`
    : ''
}`;
};
