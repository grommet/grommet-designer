
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
