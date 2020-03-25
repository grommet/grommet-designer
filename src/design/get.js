import { getComponentType } from '../utils';

export const getInitialSelected = design => ({ screen: design.screenOrder[0] });

export const getDisplayName = (design, id) => {
  const component = design.components[id];
  if (!component) return '';
  const screen = Object.keys(design.screens)
    .map(sId => design.screens[sId])
    .filter(s => s.root === id)[0];
  if (screen) return screen.name || `Screen ${screen.id}`;
  return component.name || `${component.type} ${component.id}`;
};

export const getParent = (design, id) => {
  let result;
  Object.keys(design.components).some(id2 => {
    const component = design.components[id2];
    // does this component have id as a child?
    const children = component.children;
    if (children && children.includes(id)) {
      result = design.components[id2];
      return true;
    }
    // does this component have id as a prop component
    if (component.propComponents && component.propComponents.includes(id)) {
      result = design.components[id2];
      return true;
    }
    return false;
  });
  return result;
};

export const getScreenForComponent = (design, id) => {
  let result;
  Object.keys(design.screens).some(sId => {
    const screen = design.screens[sId];
    if (screen.root === id) {
      result = screen.id;
      return true;
    }
    return false;
  });
  if (result) return result;
  const parent = getParent(design, id);
  if (parent) return getScreenForComponent(design, parent.id);
  return undefined;
};

export const getScreenByPath = (design, path) => {
  let result;
  Object.keys(design.screens).some(sId => {
    const screen = design.screens[sId];
    if (screen.path === path) {
      result = screen.id;
      return true;
    }
    return false;
  });
  return result;
};

export const isDescendent = (design, id, checkId) => {
  const parent = getParent(design, id);
  if (!parent) return false;
  if (parent.id === checkId) return true;
  return isDescendent(design, parent.id, checkId);
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
};

export const getReferences = (design, id) =>
  Object.keys(design.components)
    .map(cId => design.components[cId])
    .filter(
      c =>
        c.type === 'designer.Reference' &&
        parseInt(c.props.component, 10) === id,
    );

export const getLinkOptions = (design, libraries, selected) => {
  // options for what a Button or MenuItem should do:
  // open a layer, close the layer it is in, change screens, cycle Alternative
  const screen = design.screens[selected.screen];
  const screenComponents = screen.root
    ? getDescendants(design, screen.root)
    : [];
  return [
    ...screenComponents
      .map(k => design.components[k])
      .filter(c => {
        const type = getComponentType(libraries, c.type);
        return (type.hideable || type.cycle) && c.name; // must have a name
      })
      .map(c => ({
        screen: selected.screen,
        component: c.id,
        type: c.type,
        label: getDisplayName(design, c.id),
        key: c.id,
      })),
    ...Object.keys(design.screens)
      .map(k => design.screens[k])
      .map(s => ({
        screen: s.id,
        label: s.name || `Screen ${screen.id}`,
        key: s.id,
      })),
    {
      control: 'toggleThemeMode',
      label: '-toggle theme mode-',
      key: 'toggleThemeMode',
    },
  ];
};

export const childSelected = (design, selected) => {
  const component = design.components[selected.component];
  if (
    !component.collapsed &&
    component.children &&
    component.children.length > 0
  ) {
    return { ...selected, component: component.children[0] };
  }
};

export const parentSelected = (design, selected) => {
  const parent = getParent(design, selected.component);
  if (parent) {
    return { ...selected, component: parent.id };
  }
};

export const nextSiblingSelected = (design, selected) => {
  const screen = design.screens[selected.screen];
  if (screen.root === selected.component) {
    // next screen
    const screenIndex = design.screenOrder.indexOf(selected.screen);
    if (screenIndex < design.screenOrder.length - 1) {
      const nextScreen = design.screens[design.screenOrder[screenIndex + 1]];
      return { ...selected, screen: nextScreen.id, component: nextScreen.root };
    }
    return undefined;
  }
  // next sibling
  const parent = getParent(design, selected.component);
  let childIndex = parent.children.indexOf(selected.component);
  if (childIndex < parent.children.length - 1) {
    return { ...selected, component: parent.children[childIndex + 1] };
  }
  return undefined;
};

export const previousSiblingSelected = (design, selected) => {
  const screen = design.screens[selected.screen];
  if (screen.root === selected.component) {
    // previous screen
    const screenIndex = design.screenOrder.indexOf(selected.screen);
    if (screenIndex > 0) {
      const previousScreen =
        design.screens[design.screenOrder[screenIndex - 1]];
      return {
        ...selected,
        screen: previousScreen.id,
        component: previousScreen.root,
      };
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
};

export const canParent = (design, libraries, component) => {
  const type = getComponentType(libraries, component.type);
  let result = type.container;
  if (type.name === 'Reference' && component.props.includeChildren === false) {
    const reference = design.components[component.props.component];
    const referenceType = getComponentType(libraries, reference.type);
    result = referenceType.container;
  }
  return result;
};

export const slugify = name =>
  `/${name
    .toLocaleLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')}`;
