import React, {
  createElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { findDOMNode } from 'react-dom';
import styled from 'styled-components';
import { Box, Grommet, Paragraph, ResponsiveContext } from 'grommet';
import Icon from './libraries/designer/Icon';
import { getParent } from './design';
import { getComponentType, getReferenceDesign } from './utils';

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
  imports,
  mode,
  selected,
  theme,
  setDesign,
  setSelected,
}) => {
  const responsiveSize = useContext(ResponsiveContext);
  const [dataSources, setDataSources] = useState();
  const [data, setData] = useState();
  const [inlineEdit, setInlineEdit] = useState();
  const [dragging, setDragging] = useState();
  const [dropTarget, setDropTarget] = useState();
  const [dropAt, setDropAt] = useState();
  const grommetRef = useRef();
  const inputRef = useRef();

  const libraries = useMemo(
    () => imports.filter(i => i.library).map(i => i.library),
    [imports],
  );

  // load data, if needed
  useEffect(() => {
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

  // clear inline edit when selection changes
  useEffect(() => {
    if (inlineEdit && inlineEdit !== selected.component) {
      setInlineEdit(undefined);
    }
  }, [inlineEdit, selected.component]);

  // set Input height based on contents
  useEffect(() => {
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

  const followLink = (to, { dataContextPath, nextRef } = {}) => {
    if (Array.isArray(to)) {
      // when to is an Array, lazily create nextDesign and re-use
      const ref = {};
      to.forEach(t => followLink(t, { dataContextPath, nextRef: ref }));
      if (ref.design) setDesign(ref.design);
    } else if (to.control === 'toggleThemeMode') {
      const nextDesign =
        (nextRef && nextRef.design) || JSON.parse(JSON.stringify(design));
      nextDesign.themeMode = design.themeMode === 'dark' ? 'light' : 'dark';
      nextRef ? (nextRef.design = nextDesign) : setDesign(nextDesign);
    } else if (to.component) {
      const target = design.components[to.component];
      const hideable =
        target && getComponentType(libraries, target.type).hideable;
      const cycle = target && getComponentType(libraries, target.type).cycle;
      if (cycle) {
        const nextDesign =
          (nextRef && nextRef.design) || JSON.parse(JSON.stringify(design));
        const component = nextDesign.components[target.id];
        component.props[cycle] = component.props[cycle] + 1;
        if (component.props[cycle] > component.children.length) {
          component.props[cycle] = 1;
        }
        nextRef ? (nextRef.design = nextDesign) : setDesign(nextDesign);
      } else if (hideable) {
        const nextDesign =
          (nextRef && nextRef.design) || JSON.parse(JSON.stringify(design));
        nextDesign.components[target.id].hide = !target.hide;
        nextRef ? (nextRef.design = nextDesign) : setDesign(nextDesign);
        if (target.hide) setSelected({ ...to, dataContextPath });
      } else if (target) {
        // might not have anymore
        setSelected({ ...to, dataContextPath });
      }
    } else {
      if (design.screens[to.screen]) {
        // might not have anymore
        setSelected({ ...to, dataContextPath });
      }
    }
  };

  const toggleLink = (to, onOff, { nextRef }) => {
    if (Array.isArray(to)) {
      // when to is an Array, lazily create nextDesign and re-use
      const ref = {};
      to.forEach(t => followLink(t, { nextRef: ref }));
      if (ref.design) setDesign(ref.design);
    } else if (to.control === 'toggleThemeMode') {
      const nextDesign =
        (nextRef && nextRef.design) || JSON.parse(JSON.stringify(design));
      nextDesign.themeMode = design.themeMode === 'dark' ? 'light' : 'dark';
      nextRef ? (nextRef.design = nextDesign) : setDesign(nextDesign);
    } else if (to.component) {
      const target = design.components[to.component];
      const hideable =
        target && getComponentType(libraries, target.type).hideable;
      if (hideable) {
        const nextDesign =
          (nextRef && nextRef.design) || JSON.parse(JSON.stringify(design));
        nextDesign.components[target.id].hide = !onOff;
        nextRef ? (nextRef.design = nextDesign) : setDesign(nextDesign);
      }
    }
  };

  const renderRepeater = (component, type, { dataContextPath }) => {
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
            renderComponent(children[0], {
              dataContextPath: [...path, index],
              key: `${component.id}-${index}`,
            }),
          );
        }
      }
      if (!contents) {
        contents = [];
        for (let i = 0; i < count; i += 1) {
          contents.push(
            renderComponent(children[0], {
              dataContextPath,
              key: `${component.id}-${i}`,
            }),
          );
        }
      }
    } else if (!children || children.length === 0) {
      contents = type.placeholder;
    }
    return contents || null;
  };

  const renderComponent = (
    id,
    { dataContextPath, datum, key, referenceDesign: referenceDesignProp } = {},
  ) => {
    let component = (referenceDesignProp || design).components[id];
    let responsiveProps =
      component.responsive &&
      component.responsive[responsiveSize] &&
      component.responsive[responsiveSize].props;
    let mergedProps = responsiveProps
      ? { ...component.props, ...responsiveProps }
      : component.props;

    let parent;
    let referenceDesign = referenceDesignProp;
    if (
      component &&
      (component.type === 'designer.Reference' ||
        component.type === 'Reference')
    ) {
      if (mergedProps.includeChildren === false) {
        parent = component;
      }
      referenceDesign = getReferenceDesign(imports, component);
      component = (referenceDesign || design).components[mergedProps.component];
      if (component) {
        responsiveProps =
          component.responsive &&
          component.responsive[responsiveSize] &&
          component.responsive[responsiveSize].props;
        mergedProps = responsiveProps
          ? { ...component.props, ...responsiveProps }
          : component.props;
      }
    }
    if (!component || component.hide) return null;

    const type = getComponentType(libraries, component.type);
    if (!type) return null;

    const contextPath = dataContextPath || selected.dataContextPath;

    if (
      component.type === 'designer.Repeater' ||
      component.type === 'Repeater'
    ) {
      return renderRepeater(component, type, {
        dataContextPath: contextPath,
        referenceDesign,
      });
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
        toggleLink,
        replaceData: text => replace(text, datum || data, contextPath),
        setHide: value => setHide(id, value),
        data: dataValue || undefined,
        renderComponent,
      });
    } else {
      specialProps = {};
    }
    if (component.type === 'grommet.Layer' && grommetRef.current) {
      specialProps.target = findDOMNode(grommetRef.current);
    }

    Object.keys(mergedProps).forEach(prop => {
      if (type.properties) {
        const property = type.properties[prop];
        // use designer Icon for icons
        if (
          Array.isArray(property) &&
          component.type !== 'designer.Icon' &&
          component.type !== 'Icon' &&
          property.includes('-Icon-')
        ) {
          specialProps[prop] = <Icon icon={mergedProps[prop]} />;
        }
        if (
          typeof property === 'string' &&
          property.startsWith('-component-')
        ) {
          specialProps[prop] = renderComponent(mergedProps[prop], {
            dataContextPath,
          });
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
    } else if (mode === 'edit' && selected.component === id) {
      style = { outline: '1px dashed red' };
    }

    if (!parent) parent = component;
    let children;
    if (parent.children && parent.children.length > 0) {
      if (parent.children.length > 0) {
        children = parent.children.map(childId =>
          renderComponent(childId, { dataContextPath, datum, referenceDesign }),
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
      if (datum || data) {
        // resolve any data references
        children = replace(component.text, datum || data, contextPath);
      } else {
        children = component.text;
      }
      // if (!children) children = <>&nbsp;</>; // breaks Markdown
      if (!children) children = type.text;
    } else if (type.text) {
      children = type.text;
    } else if (specialProps && specialProps.children) {
      children = specialProps.children;
      delete specialProps.children;
    } else if (type.placeholder && !component.coupled) {
      children = <Placeholder>{type.placeholder(mergedProps)}</Placeholder>;
    }

    // We don't drag when editing so that the user can use text selection.
    const dragProps = {};
    if (mode === 'edit' && !inlineEdit) {
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
    if (mode === 'edit') {
      selectProps.onClick = event => {
        event.stopPropagation();
        if (selected.component !== id) {
          setSelected({ ...selected, component: id });
          setInlineEdit(undefined);
        } else if (type.text && !referenceDesign) {
          setInlineEdit(id);
        }
        if (specialProps.onClick) specialProps.onClick(event);
      };
      selectProps.focusIndicator = false;
    }

    if (!type.component) {
      console.error('missing component', component, type);
      return null;
    }

    return createElement(
      type.component,
      {
        key: key || id,
        ...dragProps,
        style,
        ...mergedProps,
        ...specialProps,
        ...selectProps,
      },
      children,
    );
  };

  const screen = design.screens[selected.screen];
  return (
    <Grommet
      ref={grommetRef}
      theme={theme}
      themeMode={design.themeMode}
      style={{ height: '100%' }}
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
