import { bare } from './bare';

const copyComponent = (nextDesign, design, id) => {
  const component = design.components[id];
  const nextId = nextDesign.nextId;
  nextDesign.nextId += 1;
  const nextComponent = JSON.parse(JSON.stringify(design.components[id]));
  nextComponent.id = nextId;
  nextDesign.components[nextId] = nextComponent;
  if (component.children) {
    nextComponent.children = component.children.map((childId) => {
      const nextChildId = copyComponent(nextDesign, design, childId);
      // special case DropButton dropContentId
      if (childId === component.props.dropContentId) {
        nextComponent.props.dropContentId = nextChildId;
      }
      return nextChildId;
    });
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
    // copy components from the copyScreen
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
  return copyComponent(nextDesign, nextDesign, id);
}
