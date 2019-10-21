import { bare } from './bare';
import { getParent } from './get';
import { upgradeDesign } from './upgrade';

export const copyComponent = (nextDesign, design, id) => {
  const component = design.components[id];
  const nextId = nextDesign.nextId;
  nextDesign.nextId += 1;
  const nextComponent = JSON.parse(JSON.stringify(design.components[id]));
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

export const addScreen = (nextDesign, copyScreen, selected) => {
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
  const index = nextDesign.screenOrder.indexOf(selected.screen);
  nextDesign.screenOrder.splice(index + 1, 0, screenId);

  return screenId;
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
  parent.children = parent.children.filter(i => i !== id);
  // remove any linkTo references
  Object.keys(nextDesign.components).forEach(id => {
    const component = nextDesign.components[id];
    if (component.linkTo && component.linkTo.component === id) {
      delete component.linkTo;
    }
  });
  // delete component
  delete nextDesign.components[id];
  return parent.id;
};
