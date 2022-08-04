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
let problem;

// listen for updates

export const listen = (id = 'all', func) => {
  if (!listeners[id]) listeners[id] = [];
  listeners[id].push(func);
  return () => {
    if (listeners[id]) {
      listeners[id] = listeners[id].filter((f) => f !== func);
      if (!listeners[id].length) delete listeners[id];
    }
  };
};

const notify = (id, dataArg) => {
  if (id) {
    if (Array.isArray(id))
      id.forEach(
        (id2) => listeners[id2] && listeners[id2].forEach((f) => f(dataArg)),
      );
    else listeners[id] && listeners[id].forEach((f) => f(dataArg));
  }
  if (listeners.data && data[id]) listeners.data.forEach((f) => f(data));
  if (listeners.all) listeners.all.forEach((f) => f(design));
};

const notifyChange = () => {
  Object.keys(listeners).forEach((id) => {
    if (id === 'all') listeners[id].forEach((f) => f(design));
    else {
      const data = design.components[id] || design.screens[id];
      if (data) listeners[id].forEach((f) => f(data));
    }
  });
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
      delete pubDesign.local; // just in case

      // update our persistent list of fetched designs
      const stored = localStorage.getItem('designs-fetched');
      const designsFetched = stored ? JSON.parse(stored) : [];
      const index = designsFetched.findIndex(
        ({ name }) => name === pubDesign.name,
      );
      if (index !== 0) {
        if (index !== -1) designsFetched.splice(index, 1);
        designsFetched.unshift({
          name: pubDesign.name,
          id,
          date: pubDesign.date,
        });
        localStorage.setItem('designs-fetched', JSON.stringify(designsFetched));
      }

      try {
        // cache locally, in case we want to import for templates
        localStorage.setItem(pubDesign.id, JSON.stringify(pubDesign));
      } catch (e) {
        console.log('running out of local storage to store design');
      }

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
  let needStore;

  if (name) {
    const stored = localStorage.getItem(name);

    if (!stored) {
      // design doesn't exist anymore, remove name
      const stored2 = localStorage.getItem('designs');
      if (stored2) {
        const designs = JSON.parse(stored2).filter(({ name: n }) => n !== name);
        localStorage.setItem('designs', JSON.stringify(designs));
      }
      throw new Error(404);
    }

    design = JSON.parse(stored);
    if (!design.screens && design.id) {
      design = await fetchPublished(design.id, password);
      needStore = true;
    }
  } else if (designProp) {
    design = designProp;
    needStore = true;
  } else if (id) {
    design = await fetchPublished(id, password);
  } else {
    design = newDesign();
    needStore = true;
  }

  if (includes) design.includes = includes;

  upgradeDesign(design);

  notifyChange();

  if (needStore) lazilyStore();

  theme = await loadTheme(design.theme);

  notify('theme', theme);

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

  // TODO: load includes and see if any have changed

  return design;
};

const store = (args = {}) => {
  const { preserveDate } = args;
  if (!design.local) console.error('storing non-local design');
  if (!preserveDate) {
    const now = new Date();
    now.setMilliseconds(0);
    design.date = now.toISOString();
  }
  try {
    localStorage.setItem(design.name, JSON.stringify(design));

    // keep track of the descriptor in the list of designs
    const stored = localStorage.getItem('designs');
    const designs = stored ? JSON.parse(stored) : [];
    const index = designs.findIndex(({ name }) => name === design.name);
    if (index !== -1) designs.splice(index, 1);
    const { name, id, date, local } = design;
    designs.unshift({ name, id, date, local });
    localStorage.setItem('designs', JSON.stringify(designs));
  } catch (e) {
    console.error(e);
    problem = `Alas, this browser has run out of room in local storage.
      If you delete a design you don't need or have already published,
      that will free up some space.`;
    notify('problem', problem);
  }
};

const lazilyStore = (args) => {
  if (storeTimer) clearTimeout(storeTimer);
  storeTimer = setTimeout(() => store(args), 1000);
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
        pubDesign.publishedDate = date.toISOString();
        pubDesign.id = id;
        pubDesign.local = true;
        design = pubDesign;
        store({ preserveDate: true });
        notify(undefined, pubDesign);
      });
    }
  });
};

export const revert = async () => {
  return await load({ id: design.id });
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

export const getAncestors = (id) => {
  if (!id) return [];
  if (!design?.components?.[id] && !design?.screens?.[id]) return [id];
  const parent = getParent(id);
  if (parent) return [...getAncestors(parent), id];
  return [id];
};

export const getSibling = (id) => {
  const parentId = getParent(id);
  if (parentId) {
    const parent = getComponent(parentId);
    const index = parent.children.indexOf(id);
    return parent.children[index - 1] || parent.children[index + 1];
  }
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
      (typeof component.props.title === 'string' && component.props.title) ||
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
const updateComponent = (id, func, { preserveLocal, preserveDate } = {}) => {
  const nextComponent = JSON.parse(JSON.stringify(design.components[id]));
  if (func) {
    func(nextComponent);
    design.components[id] = nextComponent;
    if (!preserveLocal) design.local = true;
    notify(id, nextComponent);
    if (design.local) lazilyStore({ preserveDate });
  }
  return nextComponent;
};

const updateScreen = (id, func, { preserveLocal, preserveDate } = {}) => {
  const nextScreen = JSON.parse(JSON.stringify(design.screens[id]));
  if (func) {
    func(nextScreen);
    design.screens[id] = nextScreen;
    if (!preserveLocal) design.local = true;
    notify(id, nextScreen);
    if (design.local) lazilyStore({ preserveDate });
  }
  return nextScreen;
};

const updateDesign = (func) => {
  const nextDesign = JSON.parse(JSON.stringify(design));
  if (func) {
    func(nextDesign);
    design = nextDesign;
    design.local = true;
    notify(undefined, nextDesign);
    lazilyStore();
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
    design.local = true;
    notify(id, nextData);
    lazilyStore();
  }
  return nextData;
};

const getNextId = () => {
  const id = design.nextId;
  design.nextId += 1;
  design.local = true;
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
  lazilyStore();
  return design;
};

export const removeDesign = () => {
  // clean up listeners
  listeners = {};

  if (design.local) {
    const name = design.name;

    // remove from the stored list of local design names
    const stored = localStorage.getItem('designs');
    if (stored) {
      const designs = JSON.parse(stored).filter(({ name: n }) => n !== name);
      localStorage.setItem('designs', JSON.stringify(designs));
    }

    // remove this design from local storage
    localStorage.removeItem(name);
  } else {
    const id = design.id;

    // remove from the stored list of local design names
    const stored = localStorage.getItem('designs-fetched');
    if (stored) {
      const designs = JSON.parse(stored).filter(({ id: i }) => i !== id);
      localStorage.setItem('designs-fetched', JSON.stringify(designs));
    }

    // remove this design from local storage
    localStorage.removeItem(id);
  }

  design = undefined;
};

const slugify = (name) =>
  name
    .toLocaleLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');

export const addScreen = () => {
  const id = getNextId();
  const name = generateName(
    'Screen',
    Object.values(design.screens).map((s) => s.name),
  );

  const screen = { id, name, path: `/${slugify(name)}` };
  design.screens[id] = screen;

  design.screenOrder = [...design.screenOrder, id];

  notify();
  lazilyStore();

  return screen;
};

export const removeScreen = (id) => {
  const screen = design.screens[id];
  if (screen?.root) removeComponent(screen.root);
  delete design.screens[id];
  // remove from screenOrder
  design.screenOrder = design.screenOrder.filter((sId) => sId !== id);
  notify(id);
  lazilyStore();
};

export const duplicateScreen = (id) => {
  const source = design.screens[id];
  const screen = JSON.parse(JSON.stringify(source));
  screen.id = getNextId();
  screen.name = `${source.name} - copy`;
  screen.path = `/${slugify(screen.name)}`;
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
  lazilyStore();
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

    // If this came from a template, remember where it came from,
    // so we can provide an option to update it if the template
    // changes.
    if (
      options?.template &&
      design.includes &&
      design.includes.find((i) => i.name === options.template.name)
    ) {
      const { name, date, id: designId } = options.template;
      component.template = { name, date, id: designId, component: id };
    }
  }

  return component.id;
};

export const setProperty = (id, section, name, value) => {
  updateComponent(
    id,
    (nextComponent) => {
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
    },
    name === 'hide' ? { preserveLocal: true } : {},
  );
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
  updateComponent(getParent(id), (nextComponent) => {
    const priorIndex = nextComponent.children.indexOf(id);
    nextComponent.children.splice(priorIndex, 1);
  });
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
  lazilyStore();
};

export const toggleCollapsed = (id, collapsed) => {
  if (design.screens[id]) {
    if (collapsed === undefined || design.screens[id].collapsed !== collapsed) {
      updateScreen(
        id,
        (nextScreen) =>
          (nextScreen.collapsed = collapsed ?? !nextScreen.collapsed),
        { preserveLocal: true, preserveDate: true },
      );
    }
  } else {
    if (
      collapsed === undefined ||
      design.components[id].collapsed !== collapsed
    ) {
      updateComponent(
        id,
        (nextComponent) =>
          (nextComponent.collapsed = collapsed ?? !nextComponent.collapsed),
        { preserveLocal: true, preserveDate: true },
      );
    }
  }
};

export const uncollapseAncestors = (ancestors) => {
  ancestors.forEach((id) => toggleCollapsed(id, false));
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
  lazilyStore();

  return design.data[id];
};

export const removeData = (id) => {
  delete design.data[id];
  notify([id, 'data']);
  lazilyStore();
};

export const setDataByPath = (path, value) => {
  const parts = path.split('.');
  const name = parts.shift();
  const id = Object.keys(data).find((id) => data[id].name === name);
  if (id && !parts.length) {
    data[id].data = value;
    notify(id);
    lazilyStore();
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
      lazilyStore();
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
    lazilyStore();
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

export const setProblem = (nextProblem) => {
  problem = nextProblem;
  notify('problem', problem);
};

// hooks

const millisecondsPerDay = 86400000;

const compareDesigns = (d1, d2) => {
  const now = new Date();
  const date1 = new Date(Date.parse(d1.date));
  const date2 = new Date(Date.parse(d2.date));
  const delta1 = now - date1;
  const delta2 = now - date2;
  const days1 = delta1 / millisecondsPerDay;
  const days2 = delta2 / millisecondsPerDay;
  if (days1 < 7 && days2 < 7) return days1 - days2;
  if (days1 < 7) return -1;
  if (days2 < 7) return 1;
  return d1.name.toLowerCase().localeCompare(d2.name.toLowerCase());
};

export const useDesigns = ({ fetched } = {}) => {
  const [designs, setDesigns] = useState([]);
  useEffect(() => {
    let nextDesigns = [];
    let stored = localStorage.getItem('designs');
    let updated = false;
    if (stored) {
      nextDesigns = JSON.parse(stored).map((des) => {
        // convert to descriptor format
        if (typeof des === 'string') {
          updated = true;
          const stored2 = localStorage.getItem(des);
          if (stored2) {
            const { name, id, date } = JSON.parse(stored2);
            return { name, id, date, local: true };
          }
          return undefined;
        }
        // const stored2 = localStorage.getItem(des.name);
        // const { name, id, date } = JSON.parse(stored2);
        // return { name, id, date, local: true };
        return des;
      });
    }
    // in case we changed anything, store back
    if (updated) localStorage.setItem('designs', JSON.stringify(nextDesigns));
    if (fetched) {
      stored = localStorage.getItem('designs-fetched');
      if (stored) nextDesigns = [...nextDesigns, ...JSON.parse(stored)];
    }
    setDesigns(
      nextDesigns.sort(compareDesigns).map((d) => {
        const slugName = slugify(d.name);
        let id;
        if (d.id) id = d.id;
        else if (d.url) id = d.url.split('=')[1];
        if (id && id.toLowerCase().startsWith(slugName)) {
          const author = id.slice(slugName.length).split('-')[1];
          return { ...d, author };
        }
        return d;
      }),
    );
  }, [fetched]);
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
            lazilyStore();
            setChanges({ designs, index: nextIndex });
          }
        : undefined,
    redo:
      index > 0
        ? () => {
            const nextIndex = Math.max(index - 1, 0);
            design = designs[nextIndex];
            notifyChange();
            lazilyStore();
            setChanges({ designs, index: nextIndex });
          }
        : undefined,
  };
};

export const useProblem = () => {
  const [, setProblem] = useState(problem);
  useEffect(() => listen('problem', setProblem), []);
  return problem;
};
