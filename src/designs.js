
export const bucketUrl = 'https://www.googleapis.com/storage/v1/b/designer-grommet/o';
export const bucketPostUrl = 'https://www.googleapis.com/upload/storage/v1/b/designer-grommet/o';
export const bucketKey = `key=${process.env.REACT_APP_API_KEY}`;

export const bare = {
  screens: { 1: { id: 1, root: 2 } },
  screenOrder: [1],
  components: {
    2: { id: 2, type: 'Grommet', props: { style: { height: '100vh' } } },
  },
};

export const rich = {
  screens: { 1: { id: 1, root: 2 } },
  screenOrder: [1],
  components: {
    2: { id: 2, type: 'Grommet', props: { style: { height: '100vh'} }, children: [3] },
    3: { id: 3, type: 'Box', props: { align: 'center', justify: 'center', pad: 'small', fill: 'vertical', background: 'brand'}, children: [4,7,5] },
    4: { id: 4, type: 'Heading', props: { size: 'large', margin: 'none' }, text: 'Designer' },
    5: { id: 5, type: 'Box', props: { align: 'center', justify: 'between', pad: 'small', direction: 'row', alignSelf: 'stretch'}, children: [8,10] },
    6: { id: 6, type: 'Icon', props: { icon: 'LinkPrevious'} },
    7: { id: 7, type: 'Paragraph', props:{ size: 'xlarge' }, text: 'Design using real grommet components!'},
    8: { id: 8, type: 'Box', props: { align: 'center', justify: 'center', pad: 'small', direction: 'row', gap: 'small' }, children: [6,9] },
    9: { id: 9, type: 'Text', props: {}, text: 'add components' },
    10: { id: 10, type: 'Box', props: { align: 'center', justify: 'center', pad: 'small', direction: 'row', gap: 'small' }, children: [11,12] },
    11: { id: 11, type: 'Text', props: {}, text: 'describe components' },
    12: { id: 12, type: 'Icon', props: { icon: 'LinkNext'} },
  },
};

export const resetState = (starter = bare) => {
  let nextId = 1;
  Object.keys(starter.screens)
    .forEach(id => (nextId = Math.max(nextId, parseInt(id, 10))));
  Object.keys(starter.components)
    .forEach(id => (nextId = Math.max(nextId, parseInt(id, 10))));
  nextId += 1;
  return {
    design: { ...starter, nextId, version: 2.0 },
    selected: { screen: 1, component: starter.screens[1].root },
  };
};

const copyComponent = (nextDesign, design, id) => {
  const nextId = nextDesign.nextId;
  nextDesign.nextId += 1;
  const component = JSON.parse(JSON.stringify(design.components[id]));
  component.id = nextId;
  nextDesign.components[nextId] = component;
  if (component.children) {
    component.children = component.children.map(childId =>
      copyComponent(nextDesign, design, childId));
  }
  return nextId;
}

export const addScreen = (nextDesign, copyScreen) => {
  // create new screen
  const screenId = nextDesign.nextId;
  nextDesign.nextId += 1;
  const screen = { id: screenId };
  nextDesign.screens[screenId] = screen;
  if (copyScreen) {
    // duplicate components from the copyScreen
    screen.root = copyComponent(nextDesign, nextDesign, copyScreen.root);
  } else {
    screen.root = copyComponent(nextDesign, bare, bare.screens[1].root);
  }

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

export const duplicateComponent = (nextDesign, id) => {
  const component = nextDesign.components[id];
  const newId = nextDesign.nextId;
  nextDesign.nextId += 1;
  const newComponent = { ...component, id: newId };
  nextDesign.components[newId] = newComponent;
  if (newComponent.children) {
    newComponent.children = newComponent.children
      .map(childId => duplicateComponent(nextDesign, childId));
  }
  return newId;
}

export const getDisplayName = (design, id) => {
  const component = design.components[id];
  if (component.type === 'Grommet') {
    const screen = Object.keys(design.screens)
      .map(sId => design.screens[sId])
      .filter(s => s.root === id)[0];
    return screen.name || `Screen ${screen.id}`;
  }
  return component.name || `${component.type} ${component.id}`;
}

export const getParent = (design, id) => {
  let result;
  Object.keys(design.components).some(id2 => {
    const children = design.components[id2].children;
    if (children && children.includes(id)) {
      result = design.components[id2];
      return true;
    }
    return false;
  });
  return result;
};

export const getScreen = (design, id) => {
  let result;
  Object.keys(design.screens).some((sId) => {
    const screen = design.screens[sId];
    if (screen.root === id) {
      result = screen.id;
      return true;
    }
    return false;
  });
  return result || getScreen(design, getParent(design, id).id);
};

const getDescendants = (design, id) => {
  let result = [];
  const component = design.components[id];
  if (component.children) {
    component.children.forEach(childId => {
      result = [...result, childId, ...getDescendants(design, childId)];
    });
  }
  return result;
}

export const getLinkOptions = (design, selected) => {
  // options for what a Button or MenuItem should do:
  // open a layer, close the layer it is in, change screens,
  const screen = design.screens[selected.screen];
  const screenComponents = getDescendants(design, screen.root);
  return [
    ...Object.keys(screenComponents).map(k => screenComponents[k])
      .filter(c => c.type === 'Layer')
      .map(c => ({ screen: selected.screen, component: c.id })),
    ...Object.keys(design.screens).map(k => design.screens[k])
      .map(s => ({ screen: s.id, component: s.root })),
    undefined
  ];
}

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

// Upgrade to latest design structure
export const upgradeDesign = (design) => {
  // add screenOrder if it isn't there
  if (!design.screenOrder) {
    design.screenOrder = Object.keys(design.screens).map(id => parseInt(id, 10));
  }
  // move components out of screens (v2.0)
  if (!design.components) {
    design.components = {};
    Object.keys(design.screens).forEach((id) => {
      const screen = design.screens[id];
      screen.root = Object.keys(screen.components)[0];
      Object.assign(design.components, screen.components);
      delete screen.components;
    });
  }
  // remove any children where the component doesn't exist anymore
  Object.keys(design.components).map(id => design.components[id])
    .forEach(component => {
      if (component.children) {
        component.children = component.children.filter(childId =>
          design.components[childId]);
      }
    });
  // remove any component that isn't a screen root or another component's child
  const found = {};
  const descend = (id) => {
    found[id] = true;
    const component = design.components[id];
    if (component.children) {
      component.children.forEach(childId => descend(childId));
    }
  };
  // record which components we have references to from screen roots
  Object.keys(design.screens).map(sId => design.screens[sId])
    .forEach(screen => descend(screen.root));
  // delete anything unreferenced
  Object.keys(design.components).forEach((id) => {
    if (!found[id]) delete design.components[id];
  });

  design.version = 2.0;
}
