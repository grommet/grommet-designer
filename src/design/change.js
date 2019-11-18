import { getComponentType } from '../utils';
import { bare } from './bare';
import { getParent } from './get';
import { upgradeDesign } from './upgrade';

export const addComponent = (nextDesign, libraries, nextSelected, typeName) => {
  const type = getComponentType(libraries, typeName);
  const id = nextDesign.nextId;
  nextDesign.nextId += 1;
  const component = {
    type: typeName,
    id,
    props: type.defaultProps ? { ...type.defaultProps } : {},
  };
  nextDesign.components[component.id] = component;
  nextSelected.component = id;

  if (type.properties) {
    // Special case any -component- properties by adding separate components
    // for them. Canvas will take care of rendering them.
    // Tree will show them so the user can select them.
    Object.keys(type.properties).forEach(prop => {
      if (
        typeof type.properties[prop] === 'string' &&
        type.properties[prop].startsWith('-component-')
      ) {
        const [, propTypeName] = type.properties[prop].split(' ');
        const propType = getComponentType(libraries, propTypeName);
        const propId = nextDesign.nextId;
        nextDesign.nextId += 1;
        const propComponent = {
          type: propTypeName,
          name: prop,
          id: propId,
          props: { ...propType.defaultProps, name: prop },
          deletable: false,
        };
        nextDesign.components[propComponent.id] = propComponent;
        const component = nextDesign.components[id];
        if (!component.propComponents) component.propComponents = [];
        component.propComponents.push(propId);
        component.props[prop] = propId;
      }
    });
  }
};

export const copyComponent = (nextDesign, design, id) => {
  const component = design.components[id];
  const nextId = nextDesign.nextId;
  nextDesign.nextId += 1;
  const nextComponent = JSON.parse(JSON.stringify(component));
  nextComponent.id = nextId;
  nextDesign.components[nextId] = nextComponent;
  if (component.children) {
    nextComponent.children = component.children.map(childId => {
      const nextChildId = copyComponent(nextDesign, design, childId);
      return nextChildId;
    });
  }
  // TODO: handle propComponents
  return nextId;
};

export const addScreen = (nextDesign, nextSelected, copyScreen) => {
  // create new screen
  const screenId = nextDesign.nextId;
  nextDesign.nextId += 1;
  const screen = { id: screenId };
  nextDesign.screens[screenId] = screen;
  if (copyScreen) {
    // copy components from the copyScreen
    if (copyScreen.id) {
      // screen in nextDesign
      screen.root = copyComponent(nextDesign, nextDesign, copyScreen.root);
    } else {
      // starter
      screen.root = copyComponent(nextDesign, copyScreen, copyScreen.root);
    }
  } else {
    screen.root = copyComponent(nextDesign, bare, bare.screens[1].root);
  }

  // set a good initial name
  const baseName = copyScreen ? copyScreen.name : 'Screen';
  const nameAvailable = name =>
    !Object.keys(nextDesign.screens)
      .map(sId => nextDesign.screens[sId])
      .some(screen => screen.name === name) && name;
  let name = nameAvailable(baseName);
  let suffix = 1;
  while (!name) {
    suffix += 1;
    name = nameAvailable(`${baseName} ${suffix}`);
  }
  nextDesign.screens[screenId].name = name;
  nextDesign.screens[screenId].path = `/screen-${suffix}`;
  const index = nextDesign.screenOrder.indexOf(nextSelected.screen);
  nextDesign.screenOrder.splice(index + 1, 0, screenId);

  nextSelected.screen = screenId;
  nextSelected.component = screen.root;
};

export const deleteScreen = (nextDesign, id) => {
  delete nextDesign.screens[id];
  const index = nextDesign.screenOrder.indexOf(id);
  nextDesign.screenOrder.splice(index, 1);
  // clean out unused components
  upgradeDesign(nextDesign);
  const nextScreenId = nextDesign.screenOrder[index ? index - 1 : index];
  return nextScreenId;
};

export const duplicateComponent = (nextDesign, id) => {
  const newId = copyComponent(nextDesign, nextDesign, id);
  const parent = getParent(nextDesign, id);
  parent.children.push(newId);
  return newId;
};

export const deleteComponent = (nextDesign, id) => {
  // remove from the parent
  const parent = getParent(nextDesign, id);
  if (parent) parent.children = parent.children.filter(i => i !== id);
  // remove propComponents
  const component = nextDesign.components[id];
  if (component.propComponents) {
    component.propComponents.forEach(i => deleteComponent(nextDesign, i));
  }
  // remove Screen root, if any
  Object.keys(nextDesign.screens)
    .map(sId => nextDesign.screens[sId])
    .forEach(screen => {
      if (screen.root === id) delete screen.root;
    });

  // NOTE: We might still have references in Button and Menu.items links or
  // Reference. We leave them alone and let upgrade() clean up eventually.

  // delete component
  delete nextDesign.components[id];
  return parent ? parent.id : undefined;
};

export const insertComponent = (
  nextDesign,
  libraries,
  selected,
  id,
  containSelected,
) => {
  const component = nextDesign.components[id];
  if (selected.component) {
    const selectedComponent = nextDesign.components[selected.component];
    const type = getComponentType(libraries, component.type);
    if (containSelected && type.container) {
      const parent = getParent(nextDesign, selected.component);
      const index = parent.children.indexOf(selected.component);
      parent.children[index] = id;
      component.children = [selected.component];
    } else {
      const selectedType = getComponentType(libraries, selectedComponent.type);
      const parent = selectedType.container
        ? selectedComponent
        : getParent(nextDesign, selected.component);
      if (!parent.children) parent.children = [];
      parent.children.push(id);
    }
  } else {
    const screen = nextDesign.screens[selected.screen];
    screen.root = id;
  }
};
