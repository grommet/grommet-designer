
export const bare = {
  screens: {
    1: {
      id: 1,
      components: {
        1: { id: 1, type: 'Grommet', props: { style: { height: '100vh' } } },
      },
    },
  },
  screenOrder: [1],
};

export const rich = {
  screens: {
    1: {
      id: 1,
      components: {
        1: { id: 1, type: 'Grommet', props: { style: { height: '100vh'} }, children: [2] },
        2: { id: 2, type: 'Box', props: { align: 'center', justify: 'center', pad: 'small', fill: 'vertical', background: 'brand'}, children: [3,6,4] },
        3: { id: 3, type: 'Heading', props: { size: 'large', margin: 'none' }, text: 'Designer' },
        4: { id: 4, type: 'Box', props: { align: 'center', justify: 'between', pad: 'small', direction: 'row', alignSelf: 'stretch'}, children: [7,9] },
        5: { id: 5, type: 'Icon', props: { icon: 'LinkPrevious'} },
        6: { id: 6, type: 'Paragraph', props:{ size: 'xlarge' }, text: 'Design using real grommet components!'},
        7: { id: 7, type: 'Box', props: { align: 'center', justify: 'center', pad: 'small', direction: 'row', gap: 'small' }, children: [5,8] },
        8: { id: 8, type: 'Text', props: {}, text: 'add components' },
        9: { id: 9, type: 'Box', props: { align: 'center', justify: 'center', pad: 'small', direction: 'row', gap: 'small' }, children: [10,11] },
        10: { id: 10, type: 'Text', props: {}, text: 'describe components' },
        11: { id: 11, type: 'Icon', props: { icon: 'LinkNext'} },
      },
    },
  },
  screenOrder: [1],
};

export const resetState = (starter = bare) => {
  let nextId = 1;
  Object.keys(starter.screens)
    .forEach(screenId => Object.keys(starter.screens[screenId].components)
      .forEach(id => (nextId = Math.max(nextId, parseInt(id, 10)))));
  nextId += 1;
  return {
    design: { ...starter, nextId, version: 1.2 },
    selected: { screen: 1, component: 1 },
  };
};

const resetId = (nextDesign, components, id) => {
  const component = components[id];
  const nextId = nextDesign.nextId;
  nextDesign.nextId += 1;
  components[nextId] = component;
  component.id = nextId;
  delete components[id];
  // update children references
  Object.keys(components).forEach(k => {
    const component = components[k];
    if (component.children) {
      const index = component.children.indexOf(id);
      if (index !== -1) {
        component.children.splice(index, 1, nextId);
      }
    }
  })
};

export const addScreen = (nextDesign, copyScreen) => {
  delete nextDesign.screenOrder;
  if (!nextDesign.screenOrder) {
    nextDesign.screenOrder = Object.keys(nextDesign.screens).map(k => parseInt(k, 10));
  }
  const screenId = nextDesign.nextId;
  nextDesign.nextId += 1;
  const screen = JSON.parse(JSON.stringify(copyScreen || bare.screens[1]));
  screen.id = screenId;
  nextDesign.screens[screenId] = screen;
  Object.keys(screen.components)
    .forEach(k => resetId(nextDesign, screen.components, parseInt(k, 10)));
  // set a good initial name
  let suffix = 0;
  let available = false;
  const suffixAvailable = suffix =>
    !Object.keys(nextDesign.screens)
    .map(sId => nextDesign.screens[sId])
    .some(screen => (screen.name === `Screen ${suffix}` || screen.id === suffix));
  while (!available) {
    suffix += 1;
    available = suffixAvailable(suffix)
  }
  nextDesign.screens[screenId].name = `Screen ${suffix}`;
  if (copyScreen) {
    const index = nextDesign.screenOrder.indexOf(copyScreen.id);
    nextDesign.screenOrder.splice(index + 1, 0, screenId);
  } else {
    nextDesign.screenOrder.push(screenId);
  }

  return screenId;
};

export const getComponent = (design, { screen, component }) =>
  design.screens[screen].components[component];

export const defaultComponent = (design, screen) =>
  parseInt(Object.keys(design.screens[screen].components)[0], 10);

export const getDisplayName = (design, ids) => {
  const component = getComponent(design, ids);
  if (!component || component.type === 'Grommet') {
    const screen = design.screens[ids.screen];
    return screen.name || `Screen ${screen.id}`;
  }
  return component.name || `${component.type} ${component.id}`;
}

export const getParent = (design, ids) => {
  const screen = design.screens[ids.screen];
  let result;
  Object.keys(screen.components).some(id => {
    const children = screen.components[id].children;
    if (children && children.includes(ids.component)) {
      result = screen.components[id];
      return true;
    }
    return false;
  });
  return result;
};

const componentToJSX = (id, screen, imports, iconImports, indent = '  ') => {
  let result;
  const component = screen.components[id];
  if (component.type === 'Icon') {
    const { icon, ...rest } = component.props;
    iconImports[icon] = true;
    result = `${indent}<${icon} ${Object.keys(rest).map(k =>
      `${k}="${rest[k]}"`).join(' ')} />`;
  } else if (component.type === 'Repeater') {
    const childId = component.children && component.children[0];
    result = childId
      ? componentToJSX(childId, screen, imports, iconImports, indent)
      : '';
  } else {
    imports[component.type] = true;
    const children = (component.children && component.children.map(cId =>
      componentToJSX(cId, screen, imports, iconImports, indent + '  ')).join("\n"))
      || (component.text && `${indent}  ${component.text}`);
    result = `${indent}<${component.type}${Object.keys(component.props).map(name => {
      const value = component.props[name];
      if (typeof value === 'string') {
        return ` ${name}="${value}"`;
      }
      return ` ${name}={${JSON.stringify(value)}}`;
    }).join('')}${component.linkTo
      ? (` onClick={() => ${component.linkTo.component
        ? `setLayer(layer ? undefined : ${component.linkTo.component})`
        : `setScreen(${component.linkTo.screen})`}}`)
      : ''}${component.type === 'Grommet' && screen.theme
      ? ` theme={${screen.theme}}`
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
${componentToJSX(defaultComponent(design, screen.id), screen,
  grommetImports, grommetIconImports)}
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
