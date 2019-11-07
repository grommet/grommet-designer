// Upgrade to latest design structure
export const upgradeDesign = design => {
  // add screenOrder if it isn't there
  if (!design.screenOrder) {
    design.screenOrder = Object.keys(design.screens).map(id =>
      parseInt(id, 10),
    );
  }
  // move components out of screens (v2.0)
  if (!design.components) {
    design.components = {};
    Object.keys(design.screens).forEach(id => {
      const screen = design.screens[id];
      screen.root = Object.keys(screen.components)[0];
      Object.assign(design.components, screen.components);
      delete screen.components;
    });
  }
  // remove any children where the component doesn't exist anymore
  Object.keys(design.components)
    .map(id => design.components[id])
    .forEach(component => {
      if (component.children) {
        component.children = component.children.filter(
          childId => design.components[childId],
        );
      }
    });

  // remove any component that isn't a screen root, another component's child,
  // or another component's propComponent
  const found = {};
  const descend = id => {
    const component = design.components[id];
    if (component) {
      found[id] = true;
      if (component.children) {
        component.children.forEach(childId => descend(childId));
      }
      if (component.propComponents) {
        component.propComponents.forEach(compId => descend(compId));
      }
    }
  };

  // ensure screen roots are numbers
  Object.keys(design.screens)
    .map(sId => design.screens[sId])
    .forEach(screen => (screen.root = parseInt(screen.root, 10)));

  // record which components we have references to from screen roots
  Object.keys(design.screens)
    .map(sId => design.screens[sId])
    .forEach(screen => descend(screen.root));
  // delete anything unreferenced
  Object.keys(design.components).forEach(id => {
    if (!found[id]) delete design.components[id];
  });

  // ensure all linkTo properties have both screen and component
  Object.keys(design.components)
    .map(id => design.components[id])
    .filter(component => component.linkTo)
    .map(component => component.linkTo)
    .forEach(linkTo => {
      if (!linkTo.component) {
        linkTo.component = design.screens[linkTo.screen].root;
      }
    });

  // make sure it has a created timestamp (2.1)
  if (!design.created) {
    design.created = new Date().toISOString();
  }

  // upgrade DropButton content (3.0)
  // before, DropButton had dropContentId property
  // after, DropButton has propComponents
  Object.keys(design.components)
    .map(id => design.components[id])
    .filter(component => component.props.dropContentId)
    .forEach(component => {
      component.propComponents = [component.props.dropContentId];
      component.props.dropContent = component.props.dropContentId;
      component.children = component.children.filter(
        id => id !== component.props.dropContentId,
      );
      delete component.props.dropContentId;
    });

  // 3.1
  // upgrade Button links to use design props
  Object.keys(design.components)
    .map(id => design.components[id])
    .filter(component => component.linkTo)
    .forEach(component => {
      if (!component.designProps) component.designProps = {};
      component.designProps.link = component.linkTo;
      delete component.linkTo;
    });
  // upgrade Menu items links to use design props
  Object.keys(design.components)
    .map(id => design.components[id])
    .filter(component => component.props.items && component.props.items[0])
    .forEach(component => {
      component.props.items.forEach(item => {
        if (item.linkTo) {
          item.link = item.linkTo;
          delete item.linkTo;
        }
      });
    });
  // remove styling property
  Object.keys(design.components)
    .map(id => design.components[id])
    .filter(component => component.props.styling)
    .forEach(component => delete component.props.styling);

  // 3.2
  // remove component from screen links
  Object.keys(design.components)
    .map(id => design.components[id])
    .forEach(component => {
      const link = component.designProps && component.designProps.link;
      if (
        link &&
        link.component &&
        design.screens[link.screen] &&
        design.screens[link.screen].root === link.component
      ) {
        delete link.component;
      }
    });
  // remove screen root Grommet components
  Object.keys(design.screens)
    .map(id => design.screens[id])
    .forEach(screen => {
      if (screen.root) {
        const root = design.components[screen.root];
        if (root && root.type === 'Grommet') {
          if (root.children && root.children.length > 0) {
            if (root.children.length === 1) {
              // if there's only one child, make it the root
              delete design.components[screen.root];
              screen.root = root.children[0];
            } else {
              // more than one child, substitute a Box
              root.type = 'grommet.Box';
              root.props = {};
            }
          } else {
            delete design.components[screen.root];
            delete screen.root;
          }
        }
      }
    });
  // move dataPath to designProperties
  Object.keys(design.components)
    .map(id => design.components[id])
    .filter(component => component.props.dataPath)
    .forEach(component => {
      if (!component.designProps) component.designProps = {};
      component.designProps.dataPath = component.props.dataPath;
      delete component.props.dataPath;
    });

  design.version = 3.2;
};
