import { getComponentType, getReferenceDesign } from '../utils';
import { themeForValue } from '../themes';

export const dependencies = (design) => {
  const result = ['styled-components'];
  result.push('https://github.com/grommet/grommet/tarball/stable');
  result.push('https://github.com/grommet/grommet-icons/tarball/stable');
  const theme = themeForValue(design.theme);
  if (theme && (theme.packageUrl || theme.packageName))
    result.push(theme.packageUrl || theme.packageName);
  return result;
};

const router = (firstPath) => `
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
    ? `${name.charAt(0).toUpperCase()}${name.replace(/\s/g, '').slice(1)}`
    : `Screen${id}`;

export const generateJSX = ({
  component,
  design,
  imports: importsArg,
  theme: themeArg,
}) => {
  const libraries = importsArg.filter((i) => i.library).map((i) => i.library);
  const imports = { Grommet: true };
  const iconImports = {};
  const theme = themeForValue(design.theme);
  const screenNames = {};
  let layers = {};
  let publishedTheme;

  const componentToJSX = ({ screen, id, indent = '  ', referenceDesign }) => {
    let result;
    const component = (referenceDesign || design).components[id];
    const type = getComponentType(libraries, component.type);
    if (component.type === 'designer.Icon' || component.type === 'Icon') {
      // convert icons to the appropriate <Icon />
      const { icon, ...rest } = component.props;
      iconImports[icon] = true;
      result = `${indent}<${icon} ${Object.keys(rest)
        .map((k) => `${k}="${rest[k]}"`)
        .join(' ')} />`;
    } else if (
      component.type === 'designer.Repeater' ||
      component.type === 'Repeater'
    ) {
      // repeat for Repeater
      const childId = component.children && component.children[0];
      result = childId
        ? (
            componentToJSX({
              screen,
              id: childId,
              indent: `${indent}  `,
              referenceDesign,
            }) + '\n'
          ).repeat(component.props.count)
        : '';
    } else if (
      component.type === 'designer.Reference' ||
      component.type === 'Reference'
    ) {
      // convert References, these are just copies for now
      // someday, we'll make them their own reusable components here
      const nextReferenceDesign = getReferenceDesign(importsArg, component);
      result = componentToJSX({
        screen,
        id: component.props.component,
        indent,
        referenceDesign: nextReferenceDesign || design,
      });
    } else {
      // no component level conversion, generate grommet component
      if (component.type === 'grommet.Layer') {
        layers[id] = true;
      }
      imports[type.name] = true;

      // generate any children
      let children =
        (component.children &&
          component.children
            .map((cId) =>
              componentToJSX({
                screen,
                id: cId,
                indent: `${indent}  `,
                referenceDesign,
              }),
            )
            .join('\n')) ||
        (component.text && `${indent}  ${component.text}`);
      if (children && children.length === 0) children = undefined;

      // ensure List children are functions
      if (component.type === 'grommet.List' && children) {
        children = `${indent}{() => (\n${children}\n${indent})}`;
      }

      const generateLinkCode = (link) => {
        let result = [];
        (Array.isArray(link) ? link : [link]).forEach((aLink) => {
          if (aLink.component) {
            if (design.components[aLink.component]) {
              result.push(`setLayer(layer ? undefined : ${aLink.component})`);
            }
          } else {
            const screen = design.screens[aLink.screen];
            if (screen) result.push(`push("${screen.path}")`);
          }
        });
        return result.join(';\n');
      };

      // if we have a link prop, generate the appropriate code to
      // follow the link. We'll add an onClick handler as the last property.
      let nav;
      if (component.designProps && component.designProps.link) {
        nav = generateLinkCode(component.designProps.link);
      }

      // generate the component JSX
      result = `${indent}<${type.name}${Object.keys(component.props)
        // strip properties with no real value
        .filter((name) => {
          const value = component.props[name];
          return !(
            (typeof value === 'object' && Object.keys(value).length === 0) ||
            value === '' ||
            value === undefined
          );
        })
        // convert properties that need any conversion
        .map((name) => {
          const value = component.props[name];
          // TODO: handle -component- props

          // convert DropButton dropContent to JSX property value
          if (
            component.type === 'grommet.DropButton' &&
            name === 'dropContent'
          ) {
            return `  dropContent={(\n${componentToJSX({
              screen,
              id: value,
              indent: `${indent}  `,
              referenceDesign,
            })}\n${indent})}\n${indent}`;
          }
          // handle any DataTable render columns
          // TODO: this seems a bit too messy
          if (component.type === 'grommet.DataTable' && name === 'columns') {
            return `\n${indent}  ${name}={[\n${indent}    ${value
              .map(
                (col) =>
                  `{${Object.keys(col)
                    .map((n) => {
                      if (n === 'render') {
                        return `render: () => (\n${componentToJSX({
                          screen,
                          id: col[n],
                          indent: `${indent}      `,
                          referenceDesign,
                        })}\n${indent}    )\n${indent}    `;
                      }
                      return `${n}: ${JSON.stringify(col[n])}`;
                    })
                    .join(', ')}}`,
              )
              .join(`,\n${indent}    `)}]}\n${indent}  `;
          }
          // convert -link- properties to navigation
          if (
            Array.isArray(type.properties[name]) &&
            type.properties[name][0] === '-link-'
          ) {
            return ` ${name}={() => {${generateLinkCode(value)}}}`;
          }
          if (typeof value === 'string') {
            // convert icon property values to inline JSX
            if (name === 'icon') {
              iconImports[value] = true;
              return ` ${name}={<${value} />}`;
            }
            // just set string property value
            return ` ${name}="${value}"`;
          }
          // set true boolean values to just the property name
          if (typeof value === 'boolean' && value) {
            return ` ${name}`;
          }
          // stringify all other values
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

  if (component) {
    return componentToJSX({ id: component.id, indent: '' });
  } else {
    if (!theme || theme.designerUrl) {
      // embed any theme from the designer, since code can't depend on it
      // directly
      publishedTheme = `const theme = ${JSON.stringify(themeArg, null, 2)}`;
    }

    Object.keys(design.screens).forEach((sId) => {
      const screen = design.screens[sId];
      screenNames[sId] = screenComponentName(screen);
    });

    const single = Object.keys(design.screens).length === 1;
    const screens = Object.keys(design.screens)
      .map((sKey) => design.screens[sKey])
      .map((screen) => {
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
  return (${single ? `\n    <Grommet full theme={theme}>` : ''}
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
}
${
  (theme &&
    !theme.designerUrl &&
    `import { ${theme.name} as theme } from '${theme.packageName}'`) ||
  ''
}
${!single ? router(design.screens[design.screenOrder[0]].path) : ''}
${publishedTheme || ''}
${screens}
${
  !single
    ? `
const App = () => (
  <Grommet full theme={theme}>
    <Router>
      <Routes>
        ${Object.keys(design.screens)
          .map((id) => design.screens[id])
          .map(
            (screen) =>
              `<Route path="${screen.path}" Component={${screenComponentName(
                screen,
              )}} />`,
          )
          .join('\n        ')}
      </Routes>
    </Router>
  </Grommet>
);

export default App;
`
    : ''
}`;
  }
};
