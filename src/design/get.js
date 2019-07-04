
export const getInitialSelected = (design) => ({
  screen: design.screenOrder[0],
  component: design.screens[design.screenOrder[0]].root,
})

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
    ...screenComponents.map(k => design.components[k])
      .filter(c => c.type === 'Layer')
      .map(c => ({ screen: selected.screen, component: c.id })),
    ...Object.keys(design.screens).map(k => design.screens[k])
      .map(s => ({ screen: s.id, component: s.root })),
    undefined
  ];
}

export const childSelected = (design, selected) => {
  const component = design.components[selected.component];
  if (!component.collapsed && component.children
    && component.children.length > 0) {
    return { ...selected, component: component.children[0] };
  }
}

export const parentSelected = (design, selected) => {
  const parent = getParent(design, selected.component);
  return { ...selected, component: parent.id };
}

export const nextSiblingSelected = (design, selected) => {
  const screen = design.screens[selected.screen];
  if (screen.root === selected.component) {
    // next screen
    const screenIndex = design.screenOrder.indexOf(selected.screen);
    if (screenIndex < (design.screenOrder.length - 1)) {
      const nextScreen = design.screens[design.screenOrder[screenIndex + 1]];
      return { ...selected, screen: nextScreen.id, component: nextScreen.root };
    }
    return undefined;
  }
  // next sibling
  const parent = getParent(design, selected.component);
  let childIndex = parent.children.indexOf(selected.component);
  if (childIndex < (parent.children.length - 1)) {
    return { ...selected, component: parent.children[childIndex + 1] };
  }
  return undefined;
}

export const previousSiblingSelected = (design, selected) => {
  const screen = design.screens[selected.screen];
  if (screen.root === selected.component) {
    // previous screen
    const screenIndex = design.screenOrder.indexOf(selected.screen);
    if (screenIndex > 0) {
      const previousScreen = design.screens[design.screenOrder[screenIndex - 1]];
      return { ...selected, screen: previousScreen.id, component: previousScreen.root };
    }
    return undefined;
  }
  // previous sibling
  const parent = getParent(design, selected.component);
  let childIndex = parent.children.indexOf(selected.component);
  if (childIndex > 0) {
    return { ...selected, component: parent.children[childIndex - 1] };
  }
  return undefined;
}

// export const nextSelected = (design, selected, descend = true) => {
//   const component = design.components[selected.component];
//   // children
//   if (descend && !component.collapsed && component.children
//     && component.children.length > 0) {
//     return { ...selected, component: component.children[0] };
//   }
//   // siblings
//   const parent = getParent(design, selected.component);
//   let childIndex = parent.children.indexOf(selected.component);
//   if (childIndex < (parent.children.length - 1)) {
//     return { ...selected, component: parent.children[childIndex + 1] };
//   }
//   // screen
//   if (parent.id === design.screens[selected.screen].root) {
//     const screenIndex = design.screenOrder.indexOf(selected.screen);
//     if (screenIndex < (design.screenOrder.length - 1)) {
//       const nextScreen = design.screens[design.screenOrder[childIndex + 1]];
//       return { ...selected, screen: nextScreen.id, component: nextScreen.root };
//     } else {
//       return undefined;
//     }
//   }
//   // aunts, uncles, etc.
//   return nextSelected(design, { ...selected, component: parent.id }, false);
// }
