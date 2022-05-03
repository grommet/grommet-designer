import { getDisplayName } from './get';

// Upgrade to latest design structure
export const upgradeDesign = (design) => {
  // add screenOrder if it isn't there
  if (!design.screenOrder) {
    design.screenOrder = Object.keys(design.screens).map((id) =>
      parseInt(id, 10),
    );
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

  // remove any screen from screenOrder that don't exist anymore
  design.screenOrder = design.screenOrder.filter((id) => design.screens[id]);

  // remove any children where the component doesn't exist anymore
  Object.keys(design.components)
    .map((id) => design.components[id])
    .forEach((component) => {
      if (component.children) {
        component.children = component.children.filter(
          (childId) => design.components[childId],
        );
      }
    });

  // remove any component that isn't a screen root, another component's child,
  // or another component's propComponent
  const found = {};
  const descend = (id) => {
    const component = design.components[id];
    if (component) {
      found[id] = true;
      if (component.children) {
        component.children.forEach((childId) => descend(childId));
      }
      if (component.propComponents) {
        component.propComponents.forEach((compId) => descend(compId));
      }
    }
  };

  // ensure screen roots are numbers
  Object.keys(design.screens)
    .map((sId) => design.screens[sId])
    .filter((screen) => screen.root)
    .forEach((screen) => (screen.root = parseInt(screen.root, 10)));

  // record which components we have references to from screen roots
  Object.keys(design.screens)
    .map((sId) => design.screens[sId])
    .forEach((screen) => descend(screen.root));
  // delete anything unreferenced
  Object.keys(design.components).forEach((id) => {
    if (!found[id]) delete design.components[id];
  });

  // ensure all linkTo properties have both screen and component
  Object.keys(design.components)
    .map((id) => design.components[id])
    .filter((component) => component.linkTo)
    .map((component) => component.linkTo)
    .forEach((linkTo) => {
      if (!linkTo.component && linkTo.screen) {
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
    .map((id) => design.components[id])
    .filter((component) => component.props.dropContentId)
    .forEach((component) => {
      component.propComponents = [component.props.dropContentId];
      component.props.dropContent = component.props.dropContentId;
      component.children = component.children.filter(
        (id) => id !== component.props.dropContentId,
      );
      delete component.props.dropContentId;
    });

  // 3.1
  // upgrade Button links to use design props
  Object.keys(design.components)
    .map((id) => design.components[id])
    .filter((component) => component.linkTo)
    .forEach((component) => {
      if (!component.designProps) component.designProps = {};
      component.designProps.link = component.linkTo;
      delete component.linkTo;
    });
  // upgrade Menu items links to use design props
  Object.keys(design.components)
    .map((id) => design.components[id])
    .filter((component) => component.props.items && component.props.items[0])
    .forEach((component) => {
      component.props.items.forEach((item) => {
        if (item.linkTo) {
          item.link = item.linkTo;
          delete item.linkTo;
        }
      });
    });
  // remove styling property
  Object.keys(design.components)
    .map((id) => design.components[id])
    .filter((component) => component.props.styling)
    .forEach((component) => delete component.props.styling);

  // 3.2
  // remove component from screen links
  Object.keys(design.components)
    .map((id) => design.components[id])
    .forEach((component) => {
      const link = component.designProps && component.designProps.link;
      if (
        link?.component &&
        design.screens[link.screen] &&
        design.screens[link.screen].root === link.component
      ) {
        delete link.component;
      }
    });
  // remove screen root Grommet components
  Object.keys(design.screens)
    .map((id) => design.screens[id])
    .forEach((screen) => {
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
    .map((id) => design.components[id])
    .filter((component) => component.props.dataPath)
    .forEach((component) => {
      if (!component.designProps) component.designProps = {};
      component.designProps.dataPath = component.props.dataPath;
      delete component.props.dataPath;
    });
  // mark any dropContent components coupled
  Object.keys(design.components)
    .map((id) => design.components[id])
    .filter((component) => component.propComponents)
    .forEach((component) => {
      component.propComponents = component.propComponents.filter(
        (id) => design.components[id],
      );
      component.propComponents.forEach((id) => {
        if (design.components[id]) {
          design.components[id].coupled = true;
        } else {
        }
      });
    });

  // convert libraries and base into imports
  if (!design.imports) design.imports = [];
  if (design.base) {
    design.imports.push({ url: design.base });
    delete design.base;
  }
  if (design.library) {
    Object.keys(design.library)
      .filter((n) => n)
      .forEach((name) => {
        design.imports.push({ name, url: design.library[name] });
      });
    delete design.library;
  }

  // remove any designProps.link that isn't there anymore
  Object.keys(design.components)
    .map((id) => design.components[id])
    .forEach((component) => {
      const validLink = (l) =>
        l.control ||
        (design.screens[l.screen] &&
          (!l.component || design.components[l.component]));
      if (component?.designProps?.link) {
        const link = component.designProps.link;
        if (Array.isArray(link)) {
          // Button
          component.designProps.link = link.filter(validLink);
        } else if (typeof link === 'object') {
          // Select, CheckBox, CheckBoxGroup
          Object.keys(link).forEach((name) => {
            if (Array.isArray(link[name])) {
              link[name] = link[name].filter(validLink);
              if (!link[name].length) delete component.designProps.link[name];
            } else if (!validLink(link[name]))
              delete component.designProps.link[name];
          });
        } else {
          if (
            !link.control &&
            (!design.screens[link.screen] ||
              (link.component && !design.components[link.component]))
          ) {
            delete component.designProps.link;
          }
        }
      }
    });

  // 3.5
  // upgrade DataChart props to align with grommet changes
  Object.keys(design.components)
    .map((id) => design.components[id])
    .filter(
      (component) =>
        component.type === 'grommet.DataChart' && !component.props.series,
    )
    .forEach((component) => {
      component.props.series = [];
      // convert chart
      component.props.chart
        .filter((c) => c.key)
        .forEach((chart) => {
          chart.property = chart.key;
          delete chart.key;
          if (component.props.series.indexOf(chart.property) === -1)
            component.props.series.push(chart.property);
          if (typeof chart.color === 'object') {
            if (chart.color.opacity) chart.opacity = chart.color.opacity;
            chart.color = chart.color.color;
          }
        });
      // convert xAxis and yAxis to axis and guide
      const xAxis = component.props.xAxis;
      if (xAxis) {
        if (xAxis.key) {
          if (!component.props.axis) component.props.axis = {};
          component.props.axis.x = { property: xAxis.key };
        }
        // TODO: xAxis.labels -> granularity
        if (xAxis.guide) {
          if (!component.props.guide) component.props.guide = {};
          component.props.guide.x = { granularity: 'coarse' };
        }
      }
      delete component.props.xAxis;
      const yAxis = component.props.yAxis;
      if (yAxis) {
        if (yAxis.key) {
          if (!component.props.axis) component.props.axis = {};
          component.props.axis.y = { property: xAxis.key };
        }
        // TODO: yAxis.labels -> granularity
        if (yAxis.guide) {
          if (!component.props.guide) component.props.guide = {};
          component.props.guide.y = { granularity: 'coarse' };
        }
      }
      delete component.props.yAxis;
      // remove thickness
      delete component.props.thickness;
    });

  // 3.6
  // remove any link options that don't have options anymore
  Object.keys(design.components)
    .map((id) => design.components[id])
    .filter(
      (component) => component.props.options && component?.designProps?.link,
    )
    .forEach((component) => {
      Object.keys(component.designProps.link).forEach((name) => {
        if (
          name !== '-any-' &&
          name !== '-none-' &&
          !component.props.options.find((o) => o === name)
        )
          delete component.designProps.link[name];
      });
    });

  // convert CheckBox design links from array to use -both-
  Object.keys(design.components)
    .map((id) => design.components[id])
    .filter(
      (component) =>
        component.type === 'grommet.CheckBox' &&
        component?.designProps?.link &&
        Array.isArray(component.designProps.link),
    )
    .forEach((component) => {
      component.designProps.link = { '-both-': component.designProps.link };
    });

  // update any link labels
  Object.keys(design.components)
    .map((id) => design.components[id])
    .filter((component) => component.designProps && component.designProps.link)
    .forEach((component) => {
      const alignLabel = (link) => {
        if (link.component) {
          link.label = getDisplayName(design, link.component);
        } else if (link.screen) {
          link.label = (design.screens[link.screen] || {}).name;
        }
      };

      if (Array.isArray(component.designProps.link))
        component.designProps.link.forEach(alignLabel);
      else if (typeof component.designProps.link === 'object')
        Object.values(component.designProps.link).forEach((link) => {
          if (Array.isArray(link)) link.forEach(alignLabel);
          else alignLabel(link);
        });
      else alignLabel(component.designProps.link);
    });

  // update DataChart chart property from array of strings to array of objects
  Object.keys(design.components)
    .map((id) => design.components[id])
    .filter(
      (component) =>
        component.type === 'grommet.DataChart' && component?.props?.chart,
    )
    .forEach((component) => {
      component.props.chart = component.props.chart.map((chart) => {
        if (Array.isArray(chart.property)) {
          chart.property = chart.property.map((property) =>
            typeof property === 'string' ? { property } : property,
          );
        }
        return chart;
      });
    });

  design.version = 3.7;
};
