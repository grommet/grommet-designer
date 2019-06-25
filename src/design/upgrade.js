
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
  // make sure it has a created timestamp (2.1)
  if (!design.created) {
    design.created = (new Date()).toISOString();
  }

  design.version = 2.1;
}
