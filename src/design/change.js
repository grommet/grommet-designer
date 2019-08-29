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

export const addScreen = (nextDesign, copyScreen, selected) => {
  // create new screen
  const screenId = nextDesign.nextId;
  nextDesign.nextId += 1;
  const screen = { id: screenId };
  nextDesign.screens[screenId] = screen;
  if (copyScreen) {
    // copy components from the copyScreen
    if (copyScreen.id) { // screen in nextDesign
      screen.root = copyComponent(nextDesign, nextDesign, copyScreen.root);
    } else { // starter
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
    .some(screen => (screen.name === name)) && name;
  let name = nameAvailable(baseName);
  let suffix = 0;
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

export const duplicateComponent = (nextDesign, id) => {
  return copyComponent(nextDesign, nextDesign, id);
}
