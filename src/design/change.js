import { bare } from './bare';

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
  nextDesign.screens[screenId].path = `/screen-${suffix}`;
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
