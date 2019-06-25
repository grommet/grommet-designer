
const componentToJSX = (design, screen, id, imports, iconImports, indent = '  ') => {
  let result;
  const component = design.components[id];
  if (component.type === 'Icon') {
    const { icon, ...rest } = component.props;
    iconImports[icon] = true;
    result = `${indent}<${icon} ${Object.keys(rest).map(k =>
      `${k}="${rest[k]}"`).join(' ')} />`;
  } else if (component.type === 'Repeater') {
    const childId = component.children && component.children[0];
    result = childId
      ? componentToJSX(design, screen, childId, imports, iconImports, indent)
        .repeat(component.props.count)
      : '';
  } else {
    imports[component.type] = true;
    const children = (component.children && component.children.map(cId =>
      componentToJSX(design, screen, cId, imports, iconImports, indent + '  ')).join("\n"))
      || (component.text && `${indent}  ${component.text}`);
    result = `${indent}<${component.type}${Object.keys(component.props).map(name => {
      const value = component.props[name];
      if (typeof value === 'string') {
        if (name === 'icon') {
          iconImports[value] = true;
          return ` ${name}={<${value} />}`;
        }
        return ` ${name}="${value}"`;
      }
      return ` ${name}={${JSON.stringify(value)}}`;
    }).join('')}${component.linkTo
      ? (` onClick={() => ${component.linkTo.component
        ? `setLayer(layer ? undefined : ${component.linkTo.component})`
        : `setScreen(${component.linkTo.screen})`}}`)
      : ''}${component.type === 'Grommet' && (screen.theme || design.theme)
      ? ` theme={${screen.theme || design.theme}}`
      : '' }${children ? '' :  ' /'}>${children ?
      `\n${children}\n${indent}</${component.type}>` : ''}`;
  }
  if (component.type === 'Layer') {
    result = `${indent}{layer === ${component.id} && (
      ${result}
    )}`
  }
  return result;
}

const screenComponentName = ({ id, name }) =>
  (name
    ? `${name.charAt(0).toUpperCase()}${name.replace(' ', '').slice(1)}`
    : `Screen${id}`);

export const generateJSX = (design) => {
  const grommetImports = {};
  const grommetIconImports = {};
  const themeImports = {};
  const screenNames = {};

  if (design.theme) themeImports[design.theme] = true;

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

  const screens = Object.keys(design.screens)
    .map(sKey => design.screens[sKey])
    .map(screen => `const ${screenComponentName(screen)} = ({ setScreen}) => {
  const [layer, setLayer] = React.useState()
  return (
${componentToJSX(design, screen, screen.root, grommetImports, grommetIconImports)}
  )
}`)
    .join("\n\n");

  return `import React, { Component } from 'react'
import { ${Object.keys(grommetImports).join(', ')} } from 'grommet'
${Object.keys(grommetIconImports).length > 0
  ? `import { ${Object.keys(grommetIconImports).join(', ')} } from 'grommet-icons'`
  : ''}
${Object.keys(themeImports).map(theme =>
  `import { ${theme} } from 'grommet-theme-${theme}'`).join('\n')}

${screens}

const screens = {
${Object.keys(design.screens).map(sId =>
  `  ${sId}: ${screenComponentName(design.screens[sId])}`).join(",\n")}
}

export default () => {
  const [screen, setScreen] = React.useState(${Object.keys(design.screens)[0]})
  const Screen = screens[screen]
  return <Screen setScreen={setScreen} />
}
`
};
