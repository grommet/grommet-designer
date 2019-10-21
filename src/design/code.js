const componentToJSX = (
  design,
  screen,
  theme,
  id,
  imports,
  iconImports,
  layers,
  indent = '  ',
) => {
  let result;
  const component = design.components[id];
  if (component.type === 'Icon') {
    const { icon, ...rest } = component.props;
    iconImports[icon] = true;
    result = `${indent}<${icon} ${Object.keys(rest)
      .map(k => `${k}="${rest[k]}"`)
      .join(' ')} />`;
  } else if (component.type === 'Repeater') {
    const childId = component.children && component.children[0];
    result = childId
      ? componentToJSX(
          design,
          screen,
          theme,
          childId,
          imports,
          iconImports,
          layers,
          `${indent}  `,
        ).repeat(component.props.count)
      : '';
  } else {
    if (component.type === 'Layer') {
      layers[id] = true;
    }
    imports[component.type] = true;
    let children =
      (component.children &&
        component.children
          .map(cId =>
            componentToJSX(
              design,
              screen,
              theme,
              cId,
              imports,
              iconImports,
              layers,
              `${indent}  `,
            ),
          )
          .join('\n')) ||
      (component.text && `${indent}  ${component.text}`);
    if (children && children.length === 0) children = undefined;
    result = `${indent}<${component.type}${Object.keys(component.props)
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
        if (component.type === 'DropButton' && name === 'dropContentId') {
          return `  dropContent={(\n${componentToJSX(
            design,
            screen,
            theme,
            value,
            imports,
            iconImports,
            layers,
            `${indent}  `,
          )}\n${indent})}\n${indent}`;
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
      component.linkTo
        ? ` onClick={() => ${
            component.linkTo.type === 'Layer'
              ? `setLayer(layer ? undefined : ${component.linkTo.component})`
              : `setScreen(${component.linkTo.screen})`
          }}`
        : ''
    }${component.type === 'Grommet' && theme ? ` theme={${theme}}` : ''}${
      children ? '' : ' /'
    }>${children ? `\n${children}\n${indent}</${component.type}>` : ''}`;
  }
  if (component.type === 'Layer') {
    result = `${indent}{layer === ${component.id} && (
      ${result}
    )}`;
  }
  return result;
};

const screenComponentName = ({ id, name }) =>
  name
    ? `${name.charAt(0).toUpperCase()}${name.replace(' ', '').slice(1)}`
    : `Screen${id}`;

export const generateJSX = (design, theme) => {
  const grommetImports = {};
  const grommetIconImports = {};
  const themeImports = {};
  const screenNames = {};
  let publishedTheme;

  if (design.theme) {
    if (design.theme.startsWith('https:')) {
      publishedTheme = `const theme = ${JSON.stringify(theme, null, 2)}`;
    } else {
      if (design.theme === 'grommet' || design.theme === 'dark') {
        grommetImports[design.theme] = true;
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
        grommetImports[screen.theme] = true;
      } else {
        themeImports[screen.theme] = true;
      }
    }
  });

  const single = Object.keys(design.screens).length === 1;
  const screens = Object.keys(design.screens)
    .map(sKey => design.screens[sKey])
    .map(screen => {
      const layers = {};
      const root = componentToJSX(
        design,
        screen,
        publishedTheme ? 'theme' : screen.theme || design.theme,
        screen.root,
        grommetImports,
        grommetIconImports,
        layers,
        '    ',
      );
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
import { ${Object.keys(grommetImports).join(', ')} } from 'grommet'
${
  Object.keys(grommetIconImports).length > 0
    ? `import { ${Object.keys(grommetIconImports).join(
        ', ',
      )} } from 'grommet-icons'`
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
