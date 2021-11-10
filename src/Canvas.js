import React, {
  createElement,
  useCallback,
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
import DesignContext from './DesignContext';
import { getParent } from './design';
import { getComponentType, getReferenceDesign } from './utils';
import InlineEditInput from './InlineEditInput';

const Placeholder = styled.div`
  pointer-events: none;
`;

const arrayExp = /(.+)\[(\d+)\]/;
// converts something like 'data[0].details' to: ['data', 0, 'details']
const parsePath = (text) =>
  text
    .split('.')
    .map((part) => {
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
  if (typeof data === 'object') value = data[pathParts[0]];
  else if (Array.isArray(data) && typeof pathParts[0] === 'number')
    value = data[pathParts[0]];
  else if (typeof data === 'string' && pathParts.length === 1 && !pathParts[0])
    value = data;

  if (value && pathParts.length > 1) {
    if (Array.isArray(value) || typeof value === 'object') {
      return find(value, pathParts.slice(1));
    }
  }
  return value;
};

const replace = (text, datas, contextPath) =>
  (text || '').replace(/\{[^}]*\}/g, (match) => {
    const dataPath = parsePath(match.slice(1, match.length - 1));
    const path = contextPath ? [...contextPath, ...dataPath] : dataPath;
    let replaced;
    datas.some((data) => (replaced = find(data, path)) !== undefined);
    if (replaced !== undefined) {
      if (typeof replaced === 'function') {
        // need to get the context to call this function from
        const funcPath = [...path];
        funcPath.pop();
        let funcContext;
        datas.some(
          (data) => (funcContext = find(data, funcPath)) !== undefined,
        );
        return replaced.call(funcContext);
      }
      return replaced;
    }
    return match;
  });

const Canvas = () => {
  const responsiveSize = useContext(ResponsiveContext);
  const {
    changeDesign,
    data,
    design,
    imports,
    mode,
    selected,
    setSelected,
    theme,
  } = useContext(DesignContext);
  // inlineEdit is the component id of the component being edited inline
  const [inlineEdit, setInlineEdit] = useState();
  const inlineEditOnChange = useCallback(
    (nextText) => {
      const nextDesign = JSON.parse(JSON.stringify(design));
      const component = nextDesign.components[inlineEdit];
      if (component) {
        component.text = nextText;
        changeDesign(nextDesign);
      }
    },
    [changeDesign, design, inlineEdit],
  );
  // inlineEditSize is the size of the component being edited inline
  const [inlineEditSize, setInlineEditSize] = useState();
  const [dragging, setDragging] = useState();
  const [dropTarget, setDropTarget] = useState();
  const [dropAt, setDropAt] = useState();
  const [dirtyData, setDirtyData] = useState({});
  const grommetRef = useRef();
  const selectedRef = useRef();
  const rendered = useRef({});
  // referenced maps rendered referenced component to its Reference
  const referenced = useRef({});
  const [initialize, setInitialize] = useState({});

  const libraries = useMemo(
    () => imports.filter((i) => i.library).map((i) => i.library),
    [imports],
  );

  // clear inline edit when selection changes
  useEffect(() => {
    if (inlineEdit && inlineEdit !== selected.component) {
      setInlineEdit(undefined);
    }
  }, [inlineEdit, selected.component]);

  const setHide = (id, hide) => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    nextDesign.components[id].hide = hide;
    changeDesign(nextDesign);
  };

  const moveComponent = () => {
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
    changeDesign(nextDesign);
  };

  const followLink = useCallback(
    (to, { dataContextPath, nextRef } = {}) => {
      if (Array.isArray(to)) {
        // when to is an Array, lazily create nextDesign and re-use
        const ref = {};
        to.forEach((t) => followLink(t, { dataContextPath, nextRef: ref }));
        if (ref.design) changeDesign(ref.design);
      } else if (to.control === 'toggleThemeMode') {
        const nextDesign =
          nextRef?.design || JSON.parse(JSON.stringify(design));
        nextDesign.themeMode = design.themeMode === 'dark' ? 'light' : 'dark';
        nextRef ? (nextRef.design = nextDesign) : changeDesign(nextDesign);
      } else if (to.component) {
        let target = design.components[to.component];
        // if we have rendered this via a Reference, use the Reference
        if (referenced.current[target.id])
          target = design.components[referenced.current[target.id]];

        let type;
        // if this is a reference, check the target type
        if (!target) type = {};
        else if (target.type === 'designer.Reference') {
          const referencedComponent = design.components[target.props.component];
          type = getComponentType(libraries, referencedComponent.type);
        } else type = getComponentType(libraries, target.type);
        const { hideable, selectable } = type;

        if (selectable) {
          const nextDesign =
            nextRef?.design || JSON.parse(JSON.stringify(design));
          const component = nextDesign.components[target.id];
          component.props.active = component.props.active + 1;
          if (component.props.active > component.children.length) {
            component.props.active = 1;
          }
          nextRef ? (nextRef.design = nextDesign) : changeDesign(nextDesign);
        } else if (hideable) {
          const nextDesign =
            nextRef?.design || JSON.parse(JSON.stringify(design));
          nextDesign.components[target.id].hide = !target.hide;
          nextRef ? (nextRef.design = nextDesign) : changeDesign(nextDesign);
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
    },
    [design, libraries, setSelected, changeDesign],
  );

  const followLinkOption = useCallback(
    (options, selected, { nextRef } = {}) => {
      const nextDesign = nextRef?.design || JSON.parse(JSON.stringify(design));
      // figure out which link to use, if any
      Object.keys(options)
        .filter((n) => options[n])
        .forEach((name) => {
          // function shared by array and non-array cases
          const updateLink = (link) => {
            if (link.control) {
              if (link.control === 'toggleThemeMode') {
                nextDesign.themeMode =
                  design.themeMode === 'dark' ? 'light' : 'dark';
              }
            } else {
              const target = design.components[link.component];
              const hideable =
                target && getComponentType(libraries, target.type).hideable;
              const selectable =
                target && getComponentType(libraries, target.type).selectable;
              if (selectable) {
                const component = nextDesign.components[target.id];
                // -link-checked- cases
                if (name === '-unchecked-' && !selected)
                  component.props.active = 1;
                else if (name === '-checked-' && selected)
                  component.props.active = 2;
                else if (name === '-both-')
                  component.props.active = component.props.active + 1;
                if (component.props.active > component.children.length) {
                  component.props.active = 1;
                }
                nextRef
                  ? (nextRef.design = nextDesign)
                  : changeDesign(nextDesign);
              } else if (hideable) {
                let hide;
                // -link-checked- cases
                if (name === '-checked-') hide = !selected;
                else if (name === '-unchecked-') hide = selected;
                // undefined ok
                else if (name === '-both-') hide = !selected;
                // -link-option- cases
                else if (name === '-any-') hide = !selected || !selected.length;
                else if (name === '-none-')
                  hide = Array.isArray(selected)
                    ? !!selected.length && selected[0] !== name
                    : !!selected && selected !== name;
                else
                  hide = Array.isArray(selected)
                    ? !selected.includes(name)
                    : selected !== name;
                if (hide !== undefined)
                  nextDesign.components[target.id].hide = hide;
              }
            }
          };

          if (Array.isArray(options[name])) options[name].forEach(updateLink);
          else updateLink(options[name]);
        });
      nextRef ? (nextRef.design = nextDesign) : changeDesign(nextDesign);
    },
    [design, libraries, changeDesign],
  );

  // Initialize components who have asked for it, one at a time in case
  // they affect others
  useEffect(() => {
    if (Object.keys(initialize).length) {
      const id = Object.keys(initialize)[0];
      const component = initialize[id];
      const type = getComponentType(libraries, component.type);
      type.initialize(component, { followLinkOption });
      const nextInitialize = { ...initialize };
      delete nextInitialize[id];
      setInitialize(nextInitialize);
    }
  }, [followLinkOption, initialize, libraries]);

  const renderRepeater = (component, type, { dataContextPath }) => {
    const {
      children,
      designProps,
      props: { count },
    } = component;
    const dataPath = designProps ? designProps.dataPath : undefined;
    let contents;
    if (children?.length === 1) {
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

  const nextRendered = {};

  const renderComponent = (
    id,
    { dataContextPath, datum, key, referenceDesign: referenceDesignProp } = {},
  ) => {
    let component = (referenceDesignProp || design).components[id];
    if (!component) {
      console.warn(`Missing component ${id}`);
      return null;
    }

    // don't render if hiding at this size
    if (
      component.responsive &&
      component.responsive.hide &&
      component.responsive.hide.includes(responsiveSize)
    )
      return null;

    let responsiveProps =
      component.responsive &&
      component.responsive[responsiveSize] &&
      component.responsive[responsiveSize].props;
    let mergedProps = responsiveProps
      ? { ...component.props, ...responsiveProps }
      : component.props;

    let parent;
    let referenceDesign = referenceDesignProp;
    let hide = !component || component.hide;
    if (
      component &&
      (component.type === 'designer.Reference' ||
        component.type === 'Reference')
    ) {
      const referringComponent = component;
      if (mergedProps.includeChildren === false) {
        parent = component;
      }
      referenceDesign = getReferenceDesign(imports, component);
      component = (referenceDesign || design).components[mergedProps.component];
      if (component) {
        // remember that we used a Reference in case a link is followed
        referenced.current[component.id] = referringComponent.id;
        // If the referring component doesn't have a name,
        // use hide from linked component
        if (!referringComponent.name) hide = component.hide;
        // don't render if hiding at this size
        if (
          component.responsive &&
          component.responsive.hide &&
          component.responsive.hide.includes(responsiveSize)
        )
          hide = true;

        responsiveProps =
          component.responsive &&
          component.responsive[responsiveSize] &&
          component.responsive[responsiveSize].props;
        mergedProps = responsiveProps
          ? { ...component.props, ...responsiveProps }
          : component.props;
      }
    }
    if (hide) return null;

    const type = getComponentType(libraries, component.type);
    if (!type) {
      console.warn(`Missing component type ${component.type}`);
      return null;
    }

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
      if (component.designProps?.dataPath) {
        ({ dataPath } = component.designProps);
        dataPath = dataContextPath
          ? [...dataContextPath, ...parsePath(dataPath)]
          : parsePath(dataPath);
        // prefer dirtyData, if we have any
        dataValue = dirtyData[dataPath.join('.')] || find(data, dataPath);
      }
      specialProps = type.override(component, {
        dataContextPath: dataPath,
        design: referenceDesignProp || design,
        followLink,
        followLinkOption,
        replaceData: (text) =>
          replace(text, [datum, dirtyData, data], contextPath),
        setHide: (value) => setHide(id, value),
        data: dataValue || undefined,
        renderComponent,
        // setData is used by Form to track Form changes.
        // These changes are stored within the dirtyData here.
        // Passing undefined will delete the dirtyData, when resetting the Form
        setData: (nextDataValue) => {
          const nextDirtyData = JSON.parse(JSON.stringify(dirtyData));
          if (nextDataValue === undefined)
            delete nextDirtyData[dataPath.join('.')];
          else nextDirtyData[dataPath.join('.')] = nextDataValue;
          setDirtyData(nextDirtyData);
        },
      });
    } else {
      specialProps = {};
    }
    if (component.type === 'grommet.Layer' && grommetRef.current) {
      specialProps.target = findDOMNode(grommetRef.current);
    }

    Object.keys(mergedProps).forEach((prop) => {
      if (type.properties) {
        const property = type.properties[prop];
        // use designer Icon for icons
        if (
          Array.isArray(property) &&
          component.type !== 'designer.Icon' &&
          component.type !== 'Icon' &&
          property.includes('-Icon-')
        ) {
          // pass along size so we can adjust the icon size as well
          specialProps[prop] = (
            <Icon icon={mergedProps[prop]} size={component.props.size} />
          );
        }
        if (
          typeof property === 'string' &&
          property.startsWith('-component-') &&
          !specialProps[prop]
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
      style = {};
    } else if (mode === 'edit' && selected.component === id) {
      style = { outline: '1px dashed red' };
    }

    if (!parent) parent = component;
    let children;
    if (specialProps?.children) {
      children = specialProps.children;
      delete specialProps.children;
    } else if (parent.children?.length > 0) {
      if (parent.children.length > 0) {
        children = parent.children.map((childId) =>
          renderComponent(childId, { dataContextPath, datum, referenceDesign }),
        );
        if (children.length === 0) children = undefined;
      }
    } else if (inlineEdit === id) {
      const useArea = type.name === 'Paragraph' || type.name === 'Markdown';
      children = (
        <InlineEditInput
          as={useArea ? 'textarea' : undefined}
          placeholder={type.text}
          defaultValue={component.text || ''}
          size={inlineEditSize}
          onChange={inlineEditOnChange}
        />
      );
    } else if (component.text !== undefined) {
      if (datum || data) {
        // resolve any data references
        children = replace(
          component.text,
          [datum, dirtyData, data],
          contextPath,
        );
      } else {
        children = component.text;
      }
      // if (!children) children = <>&nbsp;</>; // breaks Markdown
      if (children === undefined) children = type.text;
    } else if (type.text) {
      children = type.text;
    } else if (type.placeholder && !component.coupled) {
      children = <Placeholder>{type.placeholder(mergedProps)}</Placeholder>;
    }

    // We don't drag when editing so that the user can use text selection.
    const dragProps = {};
    if (mode === 'edit' && !inlineEdit) {
      dragProps.draggable = true;
      dragProps.onDragStart = (event) => {
        event.stopPropagation();
        event.dataTransfer.setData('text/plain', ''); // for Firefox
        setDragging(id);
      };
      dragProps.onDragEnd = (event) => {
        event.stopPropagation();
        setDragging(undefined);
        setDropTarget(undefined);
      };
      dragProps.onDragEnter = (event) => {
        if (droppable) event.stopPropagation();
        if (dragging && dragging !== id) {
          if (droppable) {
            setDropTarget(id);
          } else {
            setDropAt(id);
          }
        }
      };
      dragProps.onDragOver = (event) => {
        if (droppable) event.stopPropagation();
        if (dragging && dragging !== id && droppable) {
          event.preventDefault();
        }
      };
      dragProps.onDrop = (event) => {
        if (droppable) event.stopPropagation();
        moveComponent();
      };
    }

    const selectProps = {};
    if (mode === 'edit') {
      selectProps.onClick = (event) => {
        event.stopPropagation();
        if (selected.component !== id) {
          setInlineEdit(undefined);
          setSelected({ ...selected, component: id });
        } else if (type.text && !referenceDesign && selectedRef.current) {
          setInlineEditSize(selectedRef.current.getBoundingClientRect());
          setInlineEdit(id);
        }
        if (specialProps.onClick) specialProps.onClick(event);
      };
      // This causes problems when FormField checks for
      // focusIndicator === undefined for its children.
      if (
        mergedProps.focusIndicator === undefined &&
        (getParent(design, id) || {}).type !== 'grommet.FormField'
      ) {
        selectProps.focusIndicator = false;
      }
      selectProps.tabIndex = '-1';
    }

    if (!type.component) {
      console.error('missing component', component, type);
      return null;
    }

    // track which components want to initialize themselves
    if (type.initialize) nextRendered[id] = component;

    return createElement(
      // Markdown can't handle react children, when editing inline,
      // put in a div.
      inlineEdit === id && type.name === 'Markdown' ? 'div' : type.component,
      {
        key: key || id,
        ...dragProps,
        style,
        ...mergedProps,
        ...specialProps,
        ...selectProps,
        ...(selected.component === id ? { ref: selectedRef } : {}),
      },
      children,
    );
  };

  // reset referenced to clear out any old ones so it only reflects the
  // latest rendering
  referenced.current = {};

  const screen = design.screens[selected.screen];
  let content;
  if (selected.property)
    if (selected.property.component)
      // showing just a property component, no screen
      content = (
        <Box align="center" justify="center">
          {renderComponent(selected.property.component)}
        </Box>
      );
    else
      content = (
        <Box align="center">
          <Paragraph size="large" textAlign="center" color="placeholder">
            {selected.property.name} is currently empty. Add a component to it
            to to start building it out.
          </Paragraph>
        </Box>
      );
  else if (screen?.root) content = renderComponent(screen.root);
  else
    content = (
      <Box align="center">
        <Paragraph size="large" textAlign="center" color="placeholder">
          This Screen is currently empty. Add a layout component to it to to
          start building it out.
        </Paragraph>
      </Box>
    );

  // Remember which components want to be told that they should initialize
  let nextInitialize;
  Object.keys(nextRendered).forEach((id) => {
    if (!initialize[id] && !rendered.current[id]) {
      if (!nextInitialize) nextInitialize = { ...initialize };
      nextInitialize[id] = nextRendered[id];
    }
  });
  if (nextInitialize) setInitialize(nextInitialize);
  rendered.current = nextRendered;

  return (
    <Grommet
      ref={grommetRef}
      id="designer-canvas"
      theme={theme}
      themeMode={design.themeMode}
      full="min"
      style={{ height: '1px' }}
    >
      {content}
    </Grommet>
  );
};

export default Canvas;
