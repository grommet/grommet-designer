import React from 'react';
import { Grommet } from 'grommet';
import Icon from './libraries/designer/Icon';
import { getParent } from './design';
import { getComponentType } from './utils';

const arrayExp = /(.+)\[(\d+)\]/;
// converts something like 'data[0].details' to: ['data', 0, 'details']
const parsePath = text =>
  text
    .split('.')
    .map(part => {
      const match = part.match(arrayExp);
      if (match) {
        return [match[1], parseInt(match[2], 10)];
      }
      return part;
    })
    .flat();

const find = (data, path) => {
  const pathParts = typeof path === 'string' ? parsePath(path) : path;
  let value;
  if (typeof data === 'object') {
    value = data[pathParts[0]];
  } else if (Array.isArray(data) && typeof pathParts[0] === 'number') {
    value = data[pathParts[0]];
  }

  if (value && pathParts.length > 1) {
    if (Array.isArray(value) || typeof value === 'object') {
      return find(value, pathParts.slice(1));
    }
  }
  return value;
};

const replace = (text, data, contextPath) =>
  (text || '').replace(/\{[^}]*\}/g, match => {
    const dataPath = parsePath(match.slice(1, match.length - 1));
    return (
      find(data, contextPath ? [...contextPath, ...dataPath] : dataPath) ||
      match
    );
  });

const Canvas = ({
  design,
  libraries,
  preview,
  selected,
  theme,
  setDesign,
  setSelected,
}) => {
  const [data, setData] = React.useState();
  const [dragging, setDragging] = React.useState();
  const [dropTarget, setDropTarget] = React.useState();
  const [dropAt, setDropAt] = React.useState();

  // load data, if needed
  React.useEffect(() => {
    if (design.data) {
      const nextData = {};
      setData(nextData);
      Object.keys(design.data).forEach(key => {
        if (design.data[key].slice(0, 4) === 'http') {
          fetch(design.data[key])
            .then(response => response.json())
            .then(response => {
              nextData[key] = response;
              setData(nextData);
            });
        } else if (design.data[key]) {
          nextData[key] = JSON.parse(design.data[key]);
        }
      });
      setData(nextData);
    }
  }, [design.data]);

  const setHide = (id, hide) => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    nextDesign.components[id].hide = hide;
    setDesign(nextDesign);
  };

  const moveChild = () => {
    const nextDesign = JSON.parse(JSON.stringify(design));

    const parent = getParent(nextDesign, dragging);
    const index = parent.children.indexOf(dragging);

    const nextParent = nextDesign.components[dropTarget];
    if (!nextParent.children) nextParent.children = [];
    const nextIndex =
      dropAt !== undefined
        ? nextParent.children.indexOf(dropAt)
        : nextParent.children.length;

    parent.children.splice(index, 1);
    nextParent.children.splice(nextIndex, 0, dragging);

    setDragging(undefined);
    setDropTarget(undefined);
    setDropAt(undefined);
    setDesign(nextDesign);
  };

  const followLink = to => {
    if (to.component) {
      const target = design.components[to.component];
      const hideable =
        target && getComponentType(libraries, target.type).hideable;
      if (hideable) {
        setHide(target.id, !target.hide);
      } else if (target) {
        // might not have anymore
        setSelected(to);
      }
    } else {
      if (design.screens[to.screen]) {
        // might not have anymore
        setSelected(to);
      }
    }
  };

  const renderRepeater = (component, dataContextPath) => {
    const {
      children,
      props: { count, dataPath },
    } = component;
    let contents;
    if (children && children.length === 1) {
      if (data && dataPath) {
        const path = dataContextPath
          ? [...dataContextPath, ...parsePath(dataPath)]
          : parsePath(dataPath);
        const dataValue = find(data, path);
        if (dataValue && Array.isArray(dataValue)) {
          contents = dataValue.map((_, index) =>
            renderComponent(
              children[0],
              [...path, index],
              `${component.id}-${index}`,
            ),
          );
        }
      }
      if (!contents) {
        contents = [];
        for (let i = 0; i < count; i += 1) {
          contents.push(
            renderComponent(
              children[0],
              dataContextPath,
              `${component.id}-${i}`,
            ),
          );
        }
      }
    }
    return contents || null;
  };

  const renderComponent = (id, dataContextPath, key) => {
    let component = design.components[id];
    if (
      component &&
      (component.type === 'designer.Reference' ||
        component.type === 'Reference')
    ) {
      component = design.components[component.props.component];
    }
    if (!component || component.hide) return null;

    const type = getComponentType(libraries, component.type);
    if (!type) return null;

    const contextPath = dataContextPath || selected.dataContextPath;

    if (
      component.type === 'designer.Repeater' ||
      component.type === 'Repeater'
    ) {
      return renderRepeater(component, contextPath);
    }

    // set up any properties that need special handling
    const specialProps = type.override
      ? type.override(component, {
          dataContextPath,
          followLink,
          replaceData: text => replace(text, data, contextPath),
          setHide: value => setHide(id, value),
        })
      : {};
    Object.keys(component.props).forEach(prop => {
      if (type.properties) {
        const property = type.properties[prop];
        // use designer Icon for icons
        if (Array.isArray(property) && property.includes('-Icon-')) {
          specialProps[prop] = <Icon icon={component.props[prop]} />;
        }
        if (
          typeof property === 'string' &&
          property.startsWith('-component-')
        ) {
          specialProps[prop] = renderComponent(
            component.props[prop],
            dataContextPath,
          );
        }
      }
    });

    const droppable = !type.text && type.name !== 'Icon';
    let style;
    if (dropTarget === id) {
      style = { outline: '5px dashed blue' };
    } else if (dropAt === id) {
      style = { outline: '1px dashed blue' };
    } else if (!preview && selected.component === id) {
      style = { outline: '1px dashed red' };
    }

    let children;
    if (component.children) {
      if (component.children.length > 0) {
        children = component.children.map(childId =>
          renderComponent(childId, dataContextPath),
        );
        if (children.length === 0) children = undefined;
      }
    } else if (component.text) {
      if (data) {
        // resolve any data references
        children = replace(component.text, data, contextPath);
      } else {
        children = component.text;
      }
    } else if (type.text) {
      children = type.text;
    } else if (specialProps && specialProps.children) {
      children = specialProps.children;
      delete specialProps.children;
    }

    const dragProps = {};
    if (!preview) {
      dragProps.draggable = true;
      dragProps.onDragStart = event => {
        event.stopPropagation();
        event.dataTransfer.setData('text/plain', ''); // for Firefox
        setDragging(id);
      };
      dragProps.onDragEnd = event => {
        event.stopPropagation();
        setDragging(undefined);
        setDropTarget(undefined);
      };
      dragProps.onDragEnter = event => {
        if (droppable) event.stopPropagation();
        if (dragging && dragging !== id) {
          if (droppable) {
            setDropTarget(id);
          } else {
            setDropAt(id);
          }
        }
      };
      dragProps.onDragOver = event => {
        if (droppable) event.stopPropagation();
        if (dragging && dragging !== id && droppable) {
          event.preventDefault();
        }
      };
      dragProps.onDrop = event => {
        if (droppable) event.stopPropagation();
        moveChild();
      };
    }

    if (!type.component) {
      console.error('missing component', component, type);
      return null;
    }

    return React.createElement(
      type.component,
      {
        key: key || id,
        onClick: event => {
          if (event.target === event.currentTarget) {
            setSelected({ ...selected, component: id });
          }
        },
        ...dragProps,
        style,
        ...component.props,
        ...specialProps,
      },
      children,
    );
  };

  const screen = design.screens[selected.screen];
  return (
    <Grommet theme={theme} style={{ height: '100vh' }}>
      {screen && screen.root && renderComponent(screen.root)}
    </Grommet>
  );
};

export default Canvas;
