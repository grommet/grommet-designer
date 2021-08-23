import { getComponentType, getReferenceDesign } from '../utils';
import { bare } from './bare';
import { canParent, getParent, slugify } from './get';
import { upgradeDesign } from './upgrade';

export const addPropertyComponent = (
  nextDesign,
  libraries,
  id,
  { propTypeName, name, props },
) => {
  const propType = getComponentType(libraries, propTypeName);
  const propId = nextDesign.nextId;
  nextDesign.nextId += 1;
  const propComponent = {
    type: propTypeName,
    name,
    id: propId,
    props: { ...propType.defaultProps, ...props, name },
    coupled: true,
  };
  nextDesign.components[propComponent.id] = propComponent;
  const component = nextDesign.components[id];
  if (!component.propComponents) component.propComponents = [];
  component.propComponents.push(propId);
  return propId;
};

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
  if (nextSelected.property && !nextSelected.property.component) {
    nextSelected.property.component = id;
    nextSelected.property.onChange(id, nextDesign);
    const source = nextDesign.components[nextSelected.property.source];
    if (!source.propComponents) source.propComponents = [];
    source.propComponents.push(id);
  }

  if (type.properties) {
    // Special case any -component- properties by adding separate components
    // for them. Canvas will take care of rendering them.
    Object.keys(type.properties)
      .filter(
        (prop) =>
          typeof type.properties[prop] === 'string' &&
          type.properties[prop].startsWith('-component-'),
      )
      .forEach((prop) => {
        // e.g. '-component- grommet.Box {"pad":"medium"}'
        const [, propTypeName, props] = type.properties[prop].split(' ');
        if (propTypeName) {
          const propId = addPropertyComponent(nextDesign, libraries, id, {
            propTypeName,
            name: prop,
            props: props ? JSON.parse(props) : {},
          });
          component.props[prop] = propId;
        }
      });
  }
  return id;
};

// used by actions() from component libraries when generating content
export const addChildComponent = (nextDesign, parentId, { type, props }) => {
  const parent = nextDesign.components[parentId];
  const id = nextDesign.nextId;
  nextDesign.nextId += 1;
  const component = { type, id, props };
  nextDesign.components[component.id] = component;
  if (!parent.children) parent.children = [];
  parent.children.push(id);
  return id;
};

export const copyComponent = ({
  nextDesign,
  templateDesign,
  id,
  idMap: idMapArg, // only set when descending into children
  imports,
  screen,
  externalReferences = true,
}) => {
  const component = templateDesign.components[id];

  if (!externalReferences && component.type === 'designer.Reference') {
    const referenceComponent =
      templateDesign.components[component.props.component];
    if (referenceComponent) {
      const newId = copyComponent({
        nextDesign,
        templateDesign,
        id: referenceComponent.id,
        externalReferences,
      });
      return newId;
    }
    return undefined;
  }

  const nextId = nextDesign.nextId;
  nextDesign.nextId += 1;
  const nextComponent = JSON.parse(JSON.stringify(component));
  nextComponent.id = nextId;
  nextDesign.components[nextId] = nextComponent;
  // idMap maps the source id to the copied to id. This allows us to
  // fix up links to be within what was copied.
  const idMap = idMapArg || {};
  idMap[id] = nextId;

  if (component.children) {
    nextComponent.children = component.children.map((childId) => {
      const nextChildId = copyComponent({
        nextDesign,
        templateDesign,
        id: childId,
        idMap,
        screen,
        externalReferences,
      });
      return nextChildId;
    });
  }

  if (component.propComponents) {
    nextComponent.propComponents = component.propComponents.map((childId) => {
      const nextChildId = copyComponent({
        nextDesign,
        templateDesign,
        id: childId,
        idMap,
        screen,
        externalReferences,
      });
      // update corresponding property
      Object.keys(nextComponent.props).forEach((prop) => {
        if (nextComponent.props[prop] === childId) {
          nextComponent.props[prop] = nextChildId; // TODO: !!! DataTable columns
        }
      });
      return nextChildId;
    });
  }

  if (!idMapArg) {
    // we are at the root of what we've copied, see about adjusting links
    if (nextDesign.name !== templateDesign.name) {
      // We've used an import.
      Object.keys(idMap).forEach((templateId) => {
        const component = nextDesign.components[idMap[templateId]];
        if (component.designProps && component.designProps.link) {
          // Button
          if (Array.isArray(component.designProps.link)) {
            component.designProps.link = component.designProps.link
              // remove any outside of what we copied
              .filter((l) => l.screen && l.component && idMap[l.component])
              // update any we have maps to
              .map((l) => ({ screen, component: idMap[l.component] }));
          } else if (
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
          component.props.items.forEach((item) => {
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
    } else {
      // Fix up any links to point to the copied components.
      Object.keys(idMap).forEach((sourceId) => {
        const component = nextDesign.components[idMap[sourceId]];
        if (component.designProps && component.designProps.link) {
          const link = component.designProps.link;

          const relinkOne = (l) => {
            const targetId = idMap[l.component];
            if (targetId)
              return {
                ...l,
                screen: screen || l.screen,
                component: targetId,
              };
            return l;
          };

          const relinkArray = (a) => a.map(relinkOne);

          const relinkObject = (o) =>
            Object.keys(o).forEach((name) => {
              o[name] = Array.isArray(o[name])
                ? relinkArray(o[name])
                : relinkOne(o[name]);
            });

          // Button
          if (Array.isArray(link)) {
            component.designProps.link = relinkArray(link);
          } else if (typeof link === 'object') {
            relinkObject(link);
          } else if (link.component) {
            component.designProps.link = relinkOne(link);
          }
        }
        if (component.props && component.props.items) {
          // Menu
          component.props.items.forEach((item) => {
            if (item.link) {
              if (item.link.component && idMap[item.link.component]) {
                // we have a map for this, update it
                item.link.component = idMap[item.link.component];
                item.link.screen = screen || item.link.screen;
              }
            }
          });
        }
      });
    }
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
        screen: screenId, // so links can be re-linked
      });
    } else {
      // starter
      screen.root = copyComponent({
        nextDesign,
        templateDesign: copyScreen,
        id: copyScreen.root,
        screen: screenId, // so links can be re-linked
      });
    }
  } else {
    screen.root = copyComponent({
      nextDesign,
      templateDesign: bare,
      id: bare.screens[1].root,
      screen: screenId, // so links can be re-linked
    });
  }

  // set a good initial name
  const baseName = copyScreen ? copyScreen.name : 'Screen';
  const nameAvailable = (name) =>
    !Object.keys(nextDesign.screens)
      .map((sId) => nextDesign.screens[sId])
      .some((screen) => screen.name === name) && name;
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
    screen: screenId, // so links can be re-linked
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

export const deleteComponent = (nextDesign, id, nextSelected) => {
  let nextSelectedComponent;
  // remove from the parent
  const parent = getParent(nextDesign, id);
  if (parent && parent.children) {
    const index = parent.children.indexOf(id);
    if (index > 0) nextSelectedComponent = parent.children[index - 1];
    else if (index < parent.children.length - 2) {
      nextSelectedComponent = parent.children[index + 1];
    } else nextSelectedComponent = parent.id;
    parent.children = parent.children.filter((i) => i !== id);
  }

  // remove propComponents
  const component = nextDesign.components[id];
  if (component.propComponents) {
    component.propComponents.forEach((i) => deleteComponent(nextDesign, i));
  }

  if (
    nextSelected &&
    nextSelected.property &&
    nextSelected.property.component === id
  ) {
    // handle removing a property component when editing it
    nextSelected.property.onChange(undefined, nextDesign);
    const source = nextDesign.components[nextSelected.property.source];
    if (source.propComponents)
      source.propComponents = source.propComponents.filter((pId) => pId !== id);
  }

  // remove Screen root, if any
  Object.keys(nextDesign.screens)
    .map((sId) => nextDesign.screens[sId])
    .forEach((screen) => {
      if (screen.root === id) delete screen.root;
    });

  // NOTE: We might still have references in Button and Menu.items links or
  // Reference. We leave them alone and let upgrade() clean up eventually.

  // delete component
  delete nextDesign.components[id];
  if (nextSelected) nextSelected.component = nextSelectedComponent;
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
  } else if (!selected.property) {
    const screen = nextDesign.screens[selected.screen];
    screen.root = id;
  }
};

export const disconnectReference = ({ id, imports, nextDesign }) => {
  const component = nextDesign.components[id];
  const parent = getParent(nextDesign, component.id);

  // get component being referenced
  const referenceDesign = getReferenceDesign(imports, component);
  const referenceComponent = (referenceDesign || nextDesign).components[
    component.props.component
  ];
  if (referenceComponent) {
    const newId = copyComponent({
      nextDesign,
      templateDesign: referenceDesign || nextDesign,
      id: referenceComponent.id,
    });
    // copiedComponent has been inserted into the nextDesign already.
    // Place it to where this component is.
    const index = parent.children.indexOf(id);
    parent.children.splice(index + 1, 0, newId);
    deleteComponent(nextDesign, id);
    return newId;
  }
  return undefined;
};
