import { getComponentType } from '../utils';

const screenComponentName = ({ id, name }) =>
  name
    ? `${name.charAt(0).toUpperCase()}${name.replace(' ', '').slice(1)}`
    : `Screen${id}`;

export const generateJSX = (design, libraries, themeArg) => {
  const imports = {};
  const iconImports = {};
  const themeImports = {};
  const screenNames = {};
  let layers = {};
  let theme;
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
        .join('')}${
        component.designProps && component.designProps.link
          ? ` onClick={() => ${
              component.designProps.link.type === 'grommet.Layer'
                ? `setLayer(layer ? undefined : ${component.designProps.link.component})`
                : `setScreen(${component.designProps.link.screen})`
            }}`
          : ''
      }${component.type === 'Grommet' && theme ? ` theme={${theme}}` : ''}${
        children ? '' : ' /'
      }>${children ? `\n${children}\n${indent}</${type.name}>` : ''}`;
    }
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
    if (screen.theme) {
      if (screen.theme === 'grommet' || screen.theme === 'dark') {
        imports[screen.theme] = true;
      } else {
        themeImports[screen.theme] = true;
      }
    }
  });

  const single = Object.keys(design.screens).length === 1;
  const screens = Object.keys(design.screens)
    .map(sKey => design.screens[sKey])
    .map(screen => {
      layers = {};
      theme = publishedTheme ? 'theme' : screen.theme || design.theme;
      const root = componentToJSX({
        screen,
        id: screen.root,
        indent: '    ',
      });
      return `${
        single ? 'export default' : `const ${screenComponentName(screen)} =`
      } (${!single ? '{ setScreen }' : ''}) => {
  ${
    Object.keys(layers).length > 0
      ? 'const [layer, setLayer] = React.useState()'
      : ''
  }
  return (
${root}
  )
}`;
    })
    .join('\n\n');

  return `import React from 'react'
import { ${Object.keys(imports).join(', ')} } from 'grommet'
${
  Object.keys(iconImports).length > 0
    ? `import { ${Object.keys(iconImports).join(', ')} } from 'grommet-icons'`
    : ''
}
${Object.keys(themeImports)
  .map(theme => `import { ${theme} } from 'grommet-theme-${theme}'`)
  .join('\n')}
${publishedTheme || ''}
${screens}
${
  !single
    ? `
const screens = {
${Object.keys(design.screens)
  .map(sId => `  ${sId}: ${screenComponentName(design.screens[sId])}`)
  .join(',\n')}
}

export default () => {
  const [screen, setScreen] = React.useState(${Object.keys(design.screens)[0]})
  const Screen = screens[screen]
  return <Screen setScreen={setScreen} />
}
`
    : ''
}`;
};
