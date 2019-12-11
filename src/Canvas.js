import React from 'react';
import styled from 'styled-components';
import { Box, Grommet, Paragraph } from 'grommet';
import Icon from './libraries/designer/Icon';
import { getParent } from './design';
import { getComponentType } from './utils';

const InlineInput = styled.input`
  box-sizing: border-box;
  font-size: inherit;
  font-family: inherit;
  line-height: inherit;
  border: none;
  -webkit-appearance: none;
  outline: none;
  background: transparent;
  color: inherit;
  font-weight: inherit;
  text-align: inherit;
  margin: 0;
  padding: 0;
  width: 100%;
  height: auto;
  resize: none;
  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }
`;

const Placeholder = styled.div`
  pointer-events: none;
`;

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
  const [dataSources, setDataSources] = React.useState();
  const [data, setData] = React.useState();
  const [inlineEdit, setInlineEdit] = React.useState();
  const [dragging, setDragging] = React.useState();
  const [dropTarget, setDropTarget] = React.useState();
  const [dropAt, setDropAt] = React.useState();
  const inputRef = React.useRef();

  // load data, if needed
  React.useEffect(() => {
    if (design.data) {
      const nextDataSources = dataSources
        ? JSON.parse(JSON.stringify(dataSources))
        : {};
      let changed = false;
      Object.keys(design.data).forEach(key => {
        if (nextDataSources[key] !== design.data[key]) {
          nextDataSources[key] = design.data[key];
          changed = true;
          if (design.data[key].slice(0, 4) === 'http') {
            fetch(design.data[key])
              .then(response => response.json())
              .then(response => {
                const nextData = JSON.parse(JSON.stringify(data || {}));
                nextData[key] = response;
                setData(nextData);
              });
          } else if (design.data[key]) {
            try {
              const nextData = JSON.parse(JSON.stringify(data || {}));
              nextData[key] = JSON.parse(design.data[key]);
              setData(nextData);
            } catch (e) {
              console.warn(e.message);
            }
          }
        }
      });
      if (changed) setDataSources(nextDataSources);
    }
  }, [design.data, data, dataSources]);

  // set Input height based on contents
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  });

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
        setSelected(to);
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

  const renderRepeater = (component, type, dataContextPath) => {
    const {
      children,
      designProps,
      props: { count },
    } = component;
    const dataPath = designProps ? designProps.dataPath : undefined;
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
    } else if (!children || children.length === 0) {
      contents = type.placeholder;
    }
    return contents || null;
  };

  const renderComponent = (id, dataContextPath, key) => {
    let component = design.components[id];
    let parent;
    if (
      component &&
      (component.type === 'designer.Reference' ||
        component.type === 'Reference')
    ) {
      if (component && component.props.includeChildren === false) {
        parent = component;
      }
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
      return renderRepeater(component, type, contextPath);
    }

    // set up any properties that need special handling
    let specialProps;
    if (type.override) {
      let dataValue;
      let dataPath = dataContextPath;
      if (component.designProps && component.designProps.dataPath) {
        ({ dataPath } = component.designProps);
        dataPath = dataContextPath
          ? [...dataContextPath, ...parsePath(dataPath)]
          : parsePath(dataPath);
        dataValue = find(data, dataPath);
      }
      specialProps = type.override(component, {
        dataContextPath: dataPath,
        followLink,
        replaceData: text => replace(text, data, contextPath),
        setHide: value => setHide(id, value),
        data: dataValue || undefined,
      });
    } else {
      specialProps = {};
    }
    Object.keys(component.props).forEach(prop => {
      if (type.properties) {
        const property = type.properties[prop];
        // use designer Icon for icons
        if (
          Array.isArray(property) &&
          component.type !== 'designer.Icon' &&
          component.type !== 'Icon' &&
          property.includes('-Icon-')
        ) {
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
    } else if (inlineEdit === id) {
      style = { outline: '2px dashed red' };
    } else if (!preview && selected.component === id) {
      style = { outline: '1px dashed red' };
    }

    if (!parent) parent = component;
    let children;
    if (parent.children && parent.children.length > 0) {
      if (parent.children.length > 0) {
        children = parent.children.map(childId =>
          renderComponent(childId, dataContextPath),
        );
        if (children.length === 0) children = undefined;
      }
    } else if (inlineEdit === id) {
      children = (
        <InlineInput
          ref={type.name === 'Paragraph' ? inputRef : undefined}
          as={type.name === 'Paragraph' ? 'textarea' : undefined}
          placeholder={type.text}
          value={component.text || ''}
          size={component.text ? component.text.length : 4}
          onChange={event => {
            const text = event.target.value;
            const nextDesign = JSON.parse(JSON.stringify(design));
            const component = nextDesign.components[selected.component];
            component.text = text;
            setDesign(nextDesign);
          }}
        />
      );
    } else if (component.text !== undefined) {
      if (data) {
        // resolve any data references
        children = replace(component.text, data, contextPath);
      } else {
        children = component.text;
      }
      if (!children) children = <>&nbsp;</>;
    } else if (type.text) {
      children = type.text;
    } else if (specialProps && specialProps.children) {
      children = specialProps.children;
      delete specialProps.children;
    } else if (type.placeholder) {
      children = <Placeholder>{type.placeholder(component.props)}</Placeholder>;
    }

    // We don't drag when editing so that the user can use text selection.
    const dragProps = {};
    if (!preview && !inlineEdit) {
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

    const selectProps = {};
    if (!preview) {
      selectProps.onClick = event => {
        if (event.target === event.currentTarget) {
          if (selected.component !== id) {
            setSelected({ ...selected, component: id });
            setInlineEdit(undefined);
          } else if (type.text) {
            setInlineEdit(id);
          }
        }
        if (specialProps.onClick) specialProps.onClick(event);
      };
      selectProps.focusIndicator = false;
    }

    if (!type.component) {
      console.error('missing component', component, type);
      return null;
    }

    return React.createElement(
      type.component,
      {
        key: key || id,
        ...dragProps,
        style,
        ...component.props,
        ...specialProps,
        ...selectProps,
      },
      children,
    );
  };

  const screen = design.screens[selected.screen];
  return (
    <Grommet
      theme={theme}
      themeMode={design.themeMode}
      style={{ height: '100vh' }}
    >
      {screen && screen.root && renderComponent(screen.root)}
      {screen && !screen.root && (
        <Box align="center">
          <Paragraph size="large" textAlign="center" color="placeholder">
            This Screen is currently empty. Add a layout component to it to to
            start building it out.
          </Paragraph>
        </Box>
      )}
    </Grommet>
  );
};

export default Canvas;
