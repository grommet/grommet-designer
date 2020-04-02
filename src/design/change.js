import { getComponentType } from '../utils';
import { bare } from './bare';
import { canParent, getParent, slugify } from './get';
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
          coupled: true,
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

export const copyComponent = ({
  nextDesign,
  templateDesign,
  id,
  idMap: idMapArg,
  screen,
}) => {
  const component = templateDesign.components[id];
  const nextId = nextDesign.nextId;
  nextDesign.nextId += 1;
  const nextComponent = JSON.parse(JSON.stringify(component));
  nextComponent.id = nextId;
  nextDesign.components[nextId] = nextComponent;
  const idMap = idMapArg || {};
  idMap[id] = nextId;
  if (component.children) {
    nextComponent.children = component.children.map(childId => {
      const nextChildId = copyComponent({
        nextDesign,
        templateDesign,
        id: childId,
        idMap,
        screen,
      });
      return nextChildId;
    });
  }
  if (component.propComponents) {
    nextComponent.propComponents = component.propComponents.map(childId => {
      const nextChildId = copyComponent({
        nextDesign,
        templateDesign,
        id: childId,
        idMap,
        screen,
      });
      // update corresponding property
      Object.keys(nextComponent.props).forEach(prop => {
        if (nextComponent.props[prop] === childId) {
          nextComponent.props[prop] = nextChildId;
        }
      });
      return nextChildId;
    });
  }
  if (!idMapArg && nextDesign.name !== templateDesign.name) {
    // We are at the root of what was copied and we've used an import.
    // Fix up any links to point to the copied components.
    Object.keys(idMap).forEach(templateId => {
      const component = nextDesign.components[idMap[templateId]];
      if (component.designProps && component.designProps.link) {
        // Button
        if (
          component.designProps.link.screen &&
          !component.designProps.link.component
        ) {
          // this is a screen link, delete it
          delete component.designProps.link;
        } else if (idMap[component.designProps.link.component]) {
          // we have a map for this, update it
          component.designProps.link.component =
            idMap[component.designProps.link.component];
          component.designProps.link.screen = screen;
        } else {
          // we don't have a map for this, remove the link
          delete component.designProps.link;
        }
      }
      if (component.props && component.props.items) {
        // Menu
        component.props.items.forEach(item => {
          if (item.link) {
            if (item.link.screen && !item.link.component) {
              // this is a screen link, clear it
              item.link = {};
            } else if (idMap[item.link.component]) {
              // we have a map for this, update it
              item.link.component = idMap[item.link.component];
              item.link.screen = screen; // not sure what screen yet
            } else {
              // we don't have a map for this, clear the link
              item.link = {};
            }
          }
        });
      }
    });
  }
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
      screen.root = copyComponent({
        nextDesign,
        templateDesign: nextDesign,
        id: copyScreen.root,
      });
    } else {
      // starter
      screen.root = copyComponent({
        nextDesign,
        templateDesign: copyScreen,
        id: copyScreen.root,
      });
    }
  } else {
    screen.root = copyComponent({
      nextDesign,
      templateDesign: bare,
      id: bare.screens[1].root,
    });
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
  nextDesign.screens[screenId].path = slugify(name);
  const index = nextDesign.screenOrder.indexOf(nextSelected.screen);
  nextDesign.screenOrder.splice(index + 1, 0, screenId);

  nextSelected.screen = screenId;
  nextSelected.component = screen.root;
};

export const copyScreen = (nextDesign, nextSelected, starter) => {
  // create new screen
  const screenId = nextDesign.nextId;
  nextDesign.nextId += 1;
  const screen = { id: screenId };
  nextDesign.screens[screenId] = screen;
  screen.root = copyComponent({
    nextDesign,
    templateDesign: starter.starters,
    id: starter.starters.screens[starter.id].root,
  });
  nextDesign.screens[screenId].name = starter.name;
  nextDesign.screens[screenId].path = slugify(starter.name);
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

export const duplicateComponent = (nextDesign, id, parentId) => {
  const newId = copyComponent({ nextDesign, templateDesign: nextDesign, id });
  const parent = parentId
    ? nextDesign.components[parentId]
    : getParent(nextDesign, id);
  if (!parent.children) parent.children = [];
  const index = parent.children.indexOf(id);
  if (index !== -1) parent.children.splice(index + 1, 0, newId);
  else parent.children.push(newId);
  return newId;
};

export const deleteComponent = (nextDesign, id) => {
  // remove from the parent
  const parent = getParent(nextDesign, id);
  if (parent && parent.children)
    parent.children = parent.children.filter(i => i !== id);
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

export const insertComponent = ({
  nextDesign,
  libraries,
  selected,
  id,
  location,
}) => {
  const component = nextDesign.components[id];
  if (selected.component) {
    const selectedComponent = nextDesign.components[selected.component];
    const type = getComponentType(libraries, component.type);
    if (location === 'container of' && type.container) {
      const parent = getParent(nextDesign, selected.component);
      if (!parent) {
        // no parent means we want to be the screen root
        const screen = nextDesign.screens[selected.screen];
        screen.root = id;
      } else {
        const index = parent.children.indexOf(selected.component);
        parent.children[index] = id;
      }
      component.children = [selected.component];
    } else if (location === 'before') {
      const parent = getParent(nextDesign, selected.component);
      const index = parent.children.indexOf(selected.component);
      parent.children.splice(index, 0, id);
    } else if (location === 'after') {
      const parent = getParent(nextDesign, selected.component);
      const index = parent.children.indexOf(selected.component);
      parent.children.splice(index + 1, 0, id);
    } else {
      const parent = canParent(nextDesign, libraries, selectedComponent)
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
