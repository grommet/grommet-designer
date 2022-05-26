// singleton to manage design access and updates
import { useEffect, useState } from 'react';
import { apiUrl, upgradeDesign } from './design';
import { loadTheme } from './themes';
import designerLibrary from './libraries/designer';
import grommetLibrary from './libraries/grommet';

let design;
const libraries = [grommetLibrary, designerLibrary];
const librariesMap = {
  [designerLibrary.name]: designerLibrary,
  [grommetLibrary.name]: grommetLibrary,
};
let theme;
let data = {}; // id -> value
let dataIndexes = {}; // path -> index
let imports = {};

let listeners = {}; // id -> [f(), ...]

// listen for updates

export const listen = (id = 'all', func) => {
  if (!listeners[id]) listeners[id] = [];
  listeners[id].push(func);
  return () => {
    listeners[id] = listeners[id].filter((f) => f !== func);
    if (!listeners[id].length) delete listeners[id];
  };
};

const notify = (id, dataArg, { immediateStore } = {}) => {
  if (id) {
    if (Array.isArray(id))
      id.forEach(
        (id2) => listeners[id2] && listeners[id2].forEach((f) => f(dataArg)),
      );
    else listeners[id] && listeners[id].forEach((f) => f(dataArg));
  }
  if (listeners.data && data[id]) listeners.data.forEach((f) => f(data));
  if (listeners.all) listeners.all.forEach((f) => f(design));
  immediateStore ? store() : lazilyStore();
};

const notifyChange = () => {
  Object.keys(listeners).forEach((id) => {
    if (id === 'all') listeners[id].forEach((f) => f(design));
    else {
      const data = design.components[id] || design.screens[id];
      if (data) listeners[id].forEach((f) => f(data));
    }
  });
  lazilyStore();
};

// loading and storing of the entire design

let storeTimer;

const fetchPublished = async (id, password) => {
  const options = {};
  if (password) {
    options.headers = { Authorization: `Basic ${btoa(password)}` };
  }
  return fetch(`${apiUrl}/${id}`, options)
    .then((response) => {
      if (response.status === 401) throw new Error(401);
      if (response.ok) return response.json();
      throw new Error(response.status);
    })
    .then((pubDesign) => {
      // remember in case we make a change so we can set derivedFromId
      pubDesign.id = id;
      pubDesign.readonly = true;

      // update our persistent list of fetched designs
      const stored = localStorage.getItem('designs-fetched');
      const designsFetched = stored ? JSON.parse(stored) : [];
      const index = designsFetched.findIndex(
        ({ name }) => name === pubDesign.name,
      );
      if (index !== 0) {
        if (index !== -1) designsFetched.splice(index, 1);
        designsFetched.unshift({ name: pubDesign.name, id });
        localStorage.setItem('designs-fetched', JSON.stringify(designsFetched));
      }

      // cache locally, in case we want to import for templates
      localStorage.setItem(pubDesign.id, JSON.stringify(pubDesign));

      return pubDesign;
    });
};

export const load = async ({
  design: designProp,
  id,
  includes,
  name,
  password,
}) => {
  if (storeTimer) clearTimeout(storeTimer);

  if (name) {
    const stored = localStorage.getItem(name);
    design = JSON.parse(stored);
    // if this isn't a full design, we've offloaded it and need to fetch
    // the full one
    if (!design.screens && design.id) {
      design = await fetchPublished(design.id, password);
    }
  } else if (designProp) {
    design = designProp;
    // store if we don't have it, likely creating a new one
    if (!localStorage.getItem(design.name)) store();
  } else if (id) {
    design = await fetchPublished(id, password);
  } else {
    design = newDesign();
  }

  if (includes) design.includes = includes;

  upgradeDesign(design);

  notifyChange();

  theme = await loadTheme(design.theme);

  // load data: copy from design, fetch remote ones
  data = design.data ? JSON.parse(JSON.stringify(design.data)) : {};
  Object.keys(data)
    .filter((id) => data[id].url)
    .forEach((id) =>
      fetch(data[id].url)
        .then((response) => response.json())
        .then((response) => {
          data[id].data = response;
        }),
    );

  return design;
};

const store = () => {
  if (design.readonly) return;
  const date = new Date();
  date.setMilliseconds(0);
  design.date = date.toISOString();
  localStorage.setItem(design.name, JSON.stringify(design));

  // keep track of the name in the list of design names
  const stored = localStorage.getItem('designs');
  const designs = stored ? JSON.parse(stored) : [];
  const index = designs.indexOf(design.name);
  if (index !== 0) {
    if (index !== -1) designs.splice(index, 1);
    designs.unshift(design.name);
    localStorage.setItem('designs', JSON.stringify(designs));
  }
};

const lazilyStore = () => {
  if (storeTimer) clearTimeout(storeTimer);
  storeTimer = setTimeout(store, 1000);
};

const getUrlForId = (id) => {
  const { protocol, host, pathname, hash } = window.location;
  const search = `?id=${encodeURIComponent(id)}`;
  return [protocol, '//', host, pathname, search, hash].join('');
};

export const publish = ({ email, password, pin }) => {
  // add some metadata
  const pubDesign = JSON.parse(JSON.stringify(design));
  pubDesign.email = email;
  const date = new Date();
  date.setMilliseconds(pin);
  pubDesign.date = date.toISOString();
  pubDesign.password = password;
  delete pubDesign.local;
  delete pubDesign.modified;

  const body = JSON.stringify(pubDesign);
  return fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Content-Length': body.length,
    },
    body,
  }).then((response) => {
    if (response.ok) {
      response.text().then((id) => {
        pubDesign.publishedUrl = getUrlForId(id);
        pubDesign.id = id;
        pubDesign.local = true;
        pubDesign.modified = false;
        design = pubDesign;
        store();
      });
    }
  });
};

// read

export const getScreen = (id) => design.screens[id];

export const getComponent = (id) => design.components[id];

// returns parent's id, could be a component or a screen
export const getParent = (id, traverseProps = true) => {
  let result;
  Object.keys(design.components).some((id2) => {
    const component = design.components[id2];
    // check if this component has id as a child
    const children = component.children;
    if (children?.includes(id)) result = parseInt(id2, 10);
    // check if this component has id as a prop component
    if (traverseProps && !result && component?.propComponents?.includes(id))
      result = parseInt(id2, 10);
    return !!result;
  });
  if (!result) {
    Object.keys(design.screens).some((sId) => {
      if (design.screens[sId].root === id) result = parseInt(sId, 10);
      return !!result;
    });
  }
  return result;
};

export const getRoot = (id, traverseProps = true) => {
  if (!id) return design.screenOrder[0];
  if (design.screens[id]) return id;

  // check if this is the root of a screen
  let root;
  Object.keys(design.screens).some((sId) => {
    if (design.screens[sId].root === id) root = parseInt(sId, 10);
    return !!root;
  });
  if (root) return root;

  // ascend, if possible
  const parent = getParent(id, traverseProps);
  if (parent) return getRoot(parent);

  return id;
};

export const getPathForLocation = (location) => {
  if (location.screen) return getScreen(location.screen).path;
  if (location.data) return `/-data-${location.data}`;
  if (location.property) {
    const { id } = location.property;
    return `/-component-${id}`;
  }
};

export const getLocationForPath = (path) => {
  const screen = Object.values(design.screens).find((s) => s.path === path);
  if (screen) return { screen: screen.id };
  let match = /^\/-component-(\d+)$/.exec(path);
  if (match) return { property: { id: parseInt(match[1], 10) } };
  match = /^\/-data-(\d+)$/.exec(path);
  if (match) return { data: parseInt(match[1], 10) };
};

export const getDescendants = (id) => {
  const screen = design.screens[id];
  if (screen) return [screen.root, ...getDescendants(screen.root)];
  let result = [];
  const component = design.components[id];
  component?.children?.forEach((childId) => {
    result = [...result, childId, ...getDescendants(childId)];
  });
  // component?.propComponents?.forEach((propId) => {
  //   result = [...result, propId, ...getDescendants(propId)];
  // });
  return result;
};

export const getReferences = (id) =>
  Object.keys(design.components)
    .filter((id2) => {
      const component = design.components[id2];
      return (
        component.type === 'designer.Reference' &&
        component.props.component === id
      );
    })
    .map((id2) => parseInt(id2, 10));

export const getType = (typeName) => {
  if (!typeName) return undefined;
  const [libraryName, componentName] = typeName.split('.');
  return librariesMap[libraryName]?.components[componentName];
};

export const getName = (id, options) => {
  const component = (options?.template || design).components[id];
  if (component)
    return (
      component.name ||
      (typeof component.props.name === 'string' && component.props.name) ||
      (typeof component.props.label === 'string' && component.props.label) ||
      component.type.split('.')[1] ||
      component.type
    );
  const screen = (options?.template || design).screens[id];
  if (screen) return screen.name || `Screen ${screen.id}`;
  return id;
};

export const getLibraries = () => libraries;

export const getDesign = () => design;

export const getTheme = () => theme;

export const getData = (id) => data[id];

export const getDataByPath = (path, datum) => {
  const parts = path.split('.');
  let key = parts.shift();
  let pathSoFar = key; // pathSoFar is used for dataIndexes as we go
  let node = datum
    ? datum[key]
    : Object.values(data).find((d) => d.name === key)?.data;
  while (parts.length && node) {
    if (Array.isArray(node)) node = node[dataIndexes[pathSoFar] ?? 0];
    const key = parts.shift();
    pathSoFar = `${pathSoFar}.${key}`;
    node = node[key];
  }
  return node;
};

export const replaceWithData = (text, datum) =>
  // replace {data-name.key-name} with with data[data-name][key-name] content
  // OR replace {key-name} with datum[key-name] content
  (text || '').replace(
    /\{[^}]*\}/g,
    (match) => getDataByPath(match.slice(1, match.length - 1), datum) || match,
  );

export const getImports = () => imports;

export const getLinkOptions = (id) => {
  // options for what a Button or MenuItem should do:
  // open a layer, close the layer it is in, change screens, cycle Alternative
  const root = getRoot(id);
  const screenComponents = root ? getDescendants(root) : [];
  const screens = getDesign().screens;
  return [
    ...screenComponents
      .map((k) => getComponent(k))
      .map((c) =>
        c.type === 'designer.Reference' ? getComponent(c.props.component) : c,
      )
      .filter((c) => {
        const type = getType(c?.type);
        // must have a name
        return (type?.hideable || type?.selectable) && c?.name;
      })
      .map((c) => ({
        screen: root,
        component: c.id,
        type: c.type,
        label: getName(c.id),
        key: c.id,
      })),
    ...Object.keys(screens)
      .map((k) => screens[k])
      .map((s) => ({ screen: s.id, label: getName(s.id), key: s.id })),
    {
      control: 'toggleThemeMode',
      label: '-toggle theme mode-',
      key: 'toggleThemeMode',
    },
  ];
};

export const isValidId = (id) =>
  design?.screens?.[id] || design?.components?.[id] || design?.data?.[id];

// update

// passing a function to manage an update, make a copy, let the function
// update the copy, and then automatically replacing the original and
// notifying
const updateComponent = (id, func) => {
  const nextComponent = JSON.parse(JSON.stringify(design.components[id]));
  if (func) {
    func(nextComponent);
    design.components[id] = nextComponent;
    notify(id, nextComponent);
  }
  return nextComponent;
};

const updateScreen = (id, func) => {
  const nextScreen = JSON.parse(JSON.stringify(design.screens[id]));
  if (func) {
    func(nextScreen);
    design.screens[id] = nextScreen;
    notify(id, nextScreen);
  }
  return nextScreen;
};

const updateDesign = (func) => {
  const nextDesign = JSON.parse(JSON.stringify(design));
  if (func) {
    func(nextDesign);
    design = nextDesign;
    notify(undefined, nextDesign);
  }
  return nextDesign;
};

const updateData = (id, func) => {
  const nextData = JSON.parse(JSON.stringify(design.data[id]));
  if (func) {
    func(nextData);
    design.data[id] = nextData;
    if (nextData.remote) {
      if (nextData[id].url) {
        // update from URL
        fetch(nextData[id].url)
          .then((response) => response.json())
          .then((response) => {
            data[id].data = response;
          });
      }
    } else data[id] = nextData;
    notify(id, nextData);
  }
  return nextData;
};

const getNextId = () => {
  const id = design.nextId;
  design.nextId += 1;
  return id;
};

const generateName = (base, existing = [], separator = ' ') => {
  const nameAvailable = (name) => !existing.some((n) => n === name) && name;
  let name = nameAvailable(base);
  let suffix = existing.length;
  while (!name) {
    suffix += 1;
    name = nameAvailable(`${base}${separator}${suffix}`);
  }
  return name;
};

export const newDesign = (nameArg, theme = 'grommet') => {
  let name = nameArg;
  if (!name) {
    // pick a good name
    const stored = localStorage.getItem('designs');
    name = generateName('my design', stored ? JSON.parse(stored) : []);
  }

  design = {
    name,
    theme,
    screens: { 1: { id: 1, name: 'Screen', path: '/' } },
    screenOrder: [1],
    components: {},
    nextId: 2,
    local: true,
  };
  notify(undefined, design, { immediateStore: true });
  return design;
};

export const removeDesign = () => {
  const name = design.name;

  // clean up listeners
  listeners = {};

  // remove from the stored list of local design names
  const stored = localStorage.getItem('designs');
  if (stored) {
    const designs = JSON.parse(stored).filter((n) => n !== name);
    localStorage.setItem('designs', JSON.stringify(designs));
  }

  // remove this design from local storage
  localStorage.removeItem(name);

  design = undefined;
};

const slugify = (name) =>
  `/${name
    .toLocaleLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')}`;

export const addScreen = () => {
  const id = getNextId();
  const name = generateName(
    'Screen',
    Object.values(design.screens).map((s) => s.name),
  );

  const screen = { id, name, path: slugify(name) };
  design.screens[id] = screen;

  design.screenOrder = [...design.screenOrder, id];

  notify();

  return screen;
};

export const removeScreen = (id) => {
  const screen = design.screens[id];
  if (screen?.root) removeComponent(screen.root);
  delete design.screens[id];
  // remove from screenOrder
  design.screenOrder = design.screenOrder.filter((sId) => sId !== id);
  notify(id);
};

export const duplicateScreen = (id) => {
  const source = design.screens[id];
  const screen = JSON.parse(JSON.stringify(source));
  screen.id = getNextId();
  screen.name = `${source.name} - copy`;
  screen.path = slugify(screen.name);
  design.screens[screen.id] = screen;
  design.screenOrder.push(screen.id);
  if (screen.root) {
    screen.root = duplicateComponent(screen.root, {});
  }
  return screen.id;
};

const insertComponent = (id, options) => {
  // insert this component into the right parent
  if (options.within) {
    if (design.screens[options.within])
      updateScreen(options.within, (nextScreen) => (nextScreen.root = id));
    else
      updateComponent(options.within, (nextComponent) => {
        if (!nextComponent.children) nextComponent.children = [];
        nextComponent.children.push(id);
      });
  } else if (options.before) {
    updateComponent(getParent(options.before), (nextComponent) => {
      const index = nextComponent.children.indexOf(options.before);
      nextComponent.children.splice(index, 0, id);
    });
  } else if (options.after) {
    updateComponent(getParent(options.after), (nextComponent) => {
      const index = nextComponent.children.indexOf(options.after);
      nextComponent.children.splice(index + 1, 0, id);
    });
  } else if (options.containing) {
    const parentId = getParent(options.containing);
    if (design.screens[parentId]) {
      updateScreen(parentId, (nextScreen) => (nextScreen.root = id));
    } else {
      updateComponent(parentId, (nextComponent) => {
        const index = nextComponent.children.indexOf(options.containing);
        nextComponent.children[index] = id;
      });
    }
    design.components[id].children = [options.containing];
  } else if (options.for) {
    const { id: parentId, name } = options.for;
    updateComponent(parentId, (nextComponent) => {
      if (!nextComponent.propComponents) nextComponent.propComponents = [];
      nextComponent.propComponents.push(id);
      nextComponent.props[name] = id;
    });
  } else if (options.onChange) {
    options.onChange(id);
    // update propComponents
    updateComponent(options.id, (nextComponent) => {
      if (id) {
        if (!nextComponent.propComponents) nextComponent.propComponents = [];
        nextComponent.propComponents.push(id);
      } else {
        nextComponent.propComponents = nextComponent.propComponents.filter(
          (i) => i !== id,
        );
        if (!nextComponent.propComponents.length)
          delete nextComponent.propComponents;
      }
    });
  }
};

export const addComponent = (typeName, options) => {
  const type = getType(typeName);
  const id = getNextId();
  const source = options?.template || design;

  const component = {
    type: typeName,
    id,
    props: { ...type?.defaultProps, ...options?.props },
  };
  source.components[id] = component;

  // nextSelected.component = id;
  // if (nextSelected.property && !nextSelected.property.component) {
  //   nextSelected.property.component = id;
  //   nextSelected.property.onChange(id, nextDesign);
  //   const source = nextDesign.components[nextSelected.property.source];
  //   if (!source.propComponents) source.propComponents = [];
  //   source.propComponents.push(id);
  // }

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
          const propComponent = addComponent(propTypeName, {
            props: props ? JSON.parse(props) : {},
            template: options?.template,
          });
          propComponent.name = prop;
          propComponent.coupled = true;

          if (!component.propComponents) component.propComponents = [];
          component.propComponents.push(propComponent.id);
          component.props[prop] = propComponent.id;
        }
      });
  }

  insertComponent(id, options);

  return component;
};

export const removeComponent = (id) => {
  // remove from the parent
  const parentId = getParent(id);
  if (parentId) {
    if (design.screens[parentId])
      updateScreen(parentId, (nextScreen) => delete nextScreen.root);
    else
      updateComponent(parentId, (nextComponent) => {
        if (nextComponent.children) {
          nextComponent.children = nextComponent.children.filter(
            (i) => i !== id,
          );
          if (!nextComponent.children.length) delete nextComponent.children;
        }
        if (nextComponent.propComponents) {
          nextComponent.propComponents = nextComponent.propComponents.filter(
            (i) => i !== id,
          );
          if (!nextComponent.propComponents.length)
            delete nextComponent.propComponents;
        }
      });
  }

  // remove propComponents
  const component = getComponent(id);
  if (component.propComponents)
    component.propComponents.forEach(removeComponent);

  // remove children
  if (component.children) component.children.forEach(removeComponent);

  // NOTE: We might still have references in Button and Menu.items links or
  // Reference. We leave them alone and let upgrade() clean up eventually.

  // delete component
  delete design.components[id];

  notify(id);
};

export const duplicateComponent = (id, options, idMapArg) => {
  const source = options?.template || design;
  const component = JSON.parse(JSON.stringify(source.components[id]));
  component.id = getNextId();
  design.components[component.id] = component;

  const type = getType(component.type);

  // idMap maps the source id to the copied to id. This allows us to
  // fix up links to be within what was copied.
  const idMap = idMapArg || {};
  idMap[id] = component.id;

  if (component.children) {
    component.children = component.children.map((childId) =>
      duplicateComponent(childId, { template: options?.template }, idMap),
    );
  }

  // copy property components
  if (component.propComponents) {
    component.propComponents = component.propComponents.map((childId) =>
      duplicateComponent(childId, { template: options?.template }, idMap),
    );
    // update corresponding property references
    Object.keys(type.properties).forEach((name) => {
      const definition = type.properties[name];
      if (
        typeof definition === 'string' &&
        (definition.includes('-string-or-component-') ||
          definition.includes('-component-'))
      ) {
        component.props[name] =
          idMap[component.props[name]] || component.props[name];
      }
    });
  }

  // handle any deeper component copying, like DataTable columns render
  if (type.copy) {
    type.copy(source.components[id], component, {
      duplicateComponent: (id) =>
        duplicateComponent(id, { template: options?.template }, idMap),
    });
  }

  // update links
  if (!idMapArg) {
    const relink = (link) => {
      if (Array.isArray(link)) return link.map(relink);
      if (link.component) {
        const targetId = idMap[link.component];
        return targetId ? { ...link, component: targetId } : link;
      }
      if (typeof link === 'object') {
        const result = { ...link };
        Object.keys(result).forEach((name) => {
          result[name] = relink(result[name]);
        });
        return result;
      }
      return link;
    };

    Object.keys(idMap).forEach((sourceId) => {
      const component = design.components[idMap[sourceId]];
      const type = getType(component.type);

      Object.keys(type.properties).forEach((prop) => {
        const definition = type.properties[prop];
        if (component.props[prop] && definition === '-link-') {
          component.props[prop] = relink(component.props[prop]);
        }
      });

      if (type.designProperties)
        Object.keys(type.designProperties).forEach((prop) => {
          const definition = type.designProperties[prop];
          if (component?.designProps?.[prop] && definition === '-link-') {
            component.designProps[prop] = relink(component.designProps[prop]);
          }
        });

      if (type.relink) type.relink(component, { relink });
    });
  }

  if (!idMapArg) {
    // this is the top of our duplication tree, insert it appropriately
    insertComponent(component.id, options || { after: id });

    // ensure we aren't hiding the new one to start with
    delete component.hide;
  }

  return component.id;
};

export const setProperty = (id, section, name, value) => {
  updateComponent(id, (nextComponent) => {
    let props;
    if (!section) props = nextComponent;
    else if (Array.isArray(section)) {
      // e.g. ['responsive', 'small', 'props']
      props = nextComponent;
      while (section.length) {
        const key = section.shift();
        if (!props[key]) props[key] = {};
        props = props[key];
      }
    } else {
      if (!nextComponent[section]) nextComponent[section] = {};
      props = nextComponent[section];
    }
    if (value === undefined) delete props[name];
    else props[name] = value;
  });
};

export const replace = (
  sourceId,
  targetId,
  { template, includeChildren } = {},
) => {
  const source = (template || design).components[sourceId];
  updateComponent(targetId, (nextComponent) => {
    nextComponent.props = JSON.parse(JSON.stringify(source.props));
    if (source.designProps)
      nextComponent.designProps = JSON.parse(
        JSON.stringify(source.designProps),
      );
    if (source.responsive)
      nextComponent.responsive = JSON.parse(JSON.stringify(source.responsive));
  });
  if (includeChildren) {
    const target = design.components[targetId];
    if (target.children) target.children.forEach(removeComponent);
    if (source.children) {
      source.children.forEach((childId) =>
        duplicateComponent(childId, { template, within: targetId }),
      );
    }
  }
};

export const setScreenProperty = (id, name, value) => {
  updateScreen(id, (nextScreen) => {
    if (value === undefined) delete nextScreen[name];
    else nextScreen[name] = value;
  });
};

export const setDesignProperty = (name, value) => {
  updateDesign((nextDesign) => {
    if (value === undefined) delete nextDesign[name];
    else nextDesign[name] = value;
  });
};

export const setTheme = (nextTheme) => {
  updateDesign(async (nextDesign) => {
    nextDesign.theme = nextTheme;
    theme = await loadTheme(nextDesign.theme);
    notify('theme', theme);
  });
};

export const setDataProperty = (id, name, value) => {
  updateData(id, (nextData) => {
    if (value === undefined) delete nextData[name];
    else nextData[name] = value;
  });
};

export const moveComponent = (id, options) => {
  // remove from old parent
  const priorParent = getComponent(getParent(id));
  const priorIndex = priorParent.children.indexOf(id);
  priorParent.children.splice(priorIndex, 1);
  // // if we're moving within children, promote children first
  // if (isDescendent(design, dropTarget, dragging)) {
  //   const component = nextDesign.components[dragging];
  //   priorParent.children = [...priorParent.children, ...component.children];
  //   component.children = undefined;
  // }
  // insert into new parent
  insertComponent(id, options);
};

export const moveScreen = (id, options) => {
  const nextScreenOrder = design.screenOrder.filter((i) => i !== id);
  if (options.before) {
    const index = nextScreenOrder.indexOf(options.before);
    nextScreenOrder.splice(index, 0, id);
  } else if (options.after) {
    const index = nextScreenOrder.indexOf(options.after);
    nextScreenOrder.splice(index + 1, 0, id);
  }
  design.screenOrder = nextScreenOrder;
  notify();
};

export const toggleCollapsed = (id) => {
  if (design.screens[id])
    updateScreen(
      id,
      (nextScreen) => (nextScreen.collapsed = !nextScreen.collapsed),
    );
  else
    updateComponent(
      id,
      (nextComponent) => (nextComponent.collapsed = !nextComponent.collapsed),
    );
};

export const addData = () => {
  const id = getNextId();
  const name = generateName(
    'data',
    Object.values(design.data || {}).map((d) => d.name),
    '-',
  );

  if (!design.data) design.data = {};
  design.data[id] = { id, name };
  data = design.data; // TODO: for now, just local

  notify('data', design.data[id]);

  return design.data[id];
};

export const removeData = (id) => {
  delete design.data[id];
  notify([id, 'data']);
};

export const setDataByPath = (path, value) => {
  const parts = path.split('.');
  const name = parts.shift();
  const id = Object.keys(data).find((id) => data[id].name === name);
  if (id && !parts.length) {
    data[id].data = value;
    notify(id);
  } else {
    let node = data[id].data;
    while (parts.length > 1 && node) {
      const key = parts.shift();
      // TODO: remember active index and use here
      node = Array.isArray(node) ? node[0][key] : node[key];
    }
    // TODO: handle array case
    if (node) {
      node[parts[0]] = value;
      notify(id);
    }
  }
};

export const resetDataByPath = (path) => {
  const parts = path.split('.');
  const name = parts.shift();
  const id = Object.keys(data).find((id) => data[id].name === name);
  if (id && !parts.length) {
    data[id] = JSON.parse(JSON.stringify(design.data[id]));
    notify(id);
  }
};

export const setDataIndex = (path, index) => {
  const node = getDataByPath(path);
  const nextIndex =
    index !== undefined && typeof index !== 'number'
      ? node.indexOf(index)
      : index;
  if (nextIndex === undefined) delete dataIndexes[path];
  else dataIndexes[path] = nextIndex;
};

// hooks

export const useDesigns = () => {
  const [designs, setDesigns] = useState([]);
  useEffect(() => {
    let stored = localStorage.getItem('designs');
    if (stored) setDesigns(JSON.parse(stored));
  }, []);
  return designs;
};

export const useDesign = () => {
  const [, setStateDesign] = useState(design);
  useEffect(() => listen('all', setStateDesign), []);
  return design;
};

export const useDesignSummary = () => {
  const [summary, setSummary] = useState(
    design ? { name: design.name, local: design.local } : {},
  );
  useEffect(
    () =>
      listen('all', ({ name, local }) => {
        setSummary((prev) => {
          if (name !== prev.name || local !== prev.local)
            return { name, local };
          return prev;
        });
      }),
    [],
  );
  return summary;
};

export const useTheme = () => {
  const [, setStateTheme] = useState(theme);
  useEffect(() => listen('theme', setStateTheme), []);
  return theme;
};

export const useScreens = () => {
  const [, setScreens] = useState(design?.screenOrder);
  useEffect(() => listen('all', (d) => setScreens(d.screenOrder)), []);
  return design?.screenOrder;
};

export const useScreen = (id) => {
  const [, setScreen] = useState(design?.screens[id]);
  useEffect(() => listen(id, setScreen), [id]);
  return design?.screens[id];
};

export const useComponent = (id) => {
  const [, setComponent] = useState(design?.components[id]);
  useEffect(() => listen(id, setComponent), [id]);
  return design?.components[id];
};

export const useAllData = () => {
  const [, setData] = useState(data);
  useEffect(
    () =>
      listen('data', () => {
        setData({ ...data });
      }),
    [],
  );
  return data;
};

export const useData = (id) => {
  const [, setData] = useState(data[id]);
  useEffect(() => listen(id, setData), [id]);
  return data[id];
};

export const useChanges = () => {
  const [{ designs, index }, setChanges] = useState({
    designs: design ? [JSON.parse(JSON.stringify(design))] : [],
    index: design ? 0 : -1,
  });

  useEffect(() => {
    listen('all', () => {
      // TODO: delay to ride out small changes better
      setChanges((prevChanges) => {
        const { designs: prevDesigns, index: prevIndex } = prevChanges;
        const nextDesigns = prevDesigns.slice(prevIndex, 10);
        nextDesigns.unshift(JSON.parse(JSON.stringify(design)));
        return { designs: nextDesigns, index: 0 };
      });
    });
  }, []);

  return {
    undo:
      index < designs.length - 1
        ? () => {
            const nextIndex = Math.min(index + 1, designs.length - 1);
            design = designs[nextIndex];
            notifyChange();
            setChanges({ designs, index: nextIndex });
          }
        : undefined,
    redo:
      index > 0
        ? () => {
            const nextIndex = Math.max(index - 1, 0);
            design = designs[nextIndex];
            notifyChange();
            setChanges({ designs, index: nextIndex });
          }
        : undefined,
  };
};
