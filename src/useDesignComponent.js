import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components';
import { ResponsiveContext } from 'grommet';
import Icon from './libraries/designer/Icon';
import SelectionContext from './SelectionContext';
import {
  getComponent,
  getType,
  replaceWithData,
  setProperty,
  useComponent,
} from './design2';
import DesignComponent from './DesignComponent';
import InlineEditInput from './InlineEditInput';

const renderNull = {};

const Placeholder = styled.div`
  pointer-events: none;
`;

let clickBusy = false;

// pass style so selection of a Reference shows the selection indicator
const useDesignComponent = (id, datum, style) => {
  const [selection, setSelection, { followLink, followLinkOption }] =
    useContext(SelectionContext);
  const responsiveSize = useContext(ResponsiveContext);
  const component = useComponent(id);

  // inlineEdit is the component id of the component being edited inline
  const inlineEditOnChange = useCallback(
    (nextText) => {
      setProperty(id, undefined, 'text', nextText);
    },
    [id],
  );
  // inlineEditSize is the size of the component being edited inline
  const [inlineEditSize, setInlineEditSize] = useState();

  // clear inline edit size when selection changes
  useEffect(() => setInlineEditSize(undefined), [selection]);

  const [, rerender] = useState();

  const type = useMemo(
    () => (component ? getType(component.type) : undefined),
    [component],
  );

  // Ensure we don't change props or children if not needed, to avoid
  // re-rendering when not needed. Tabs+Tab+children is vulnerable.
  const [props, children] = useMemo(() => {
    if (
      !component ||
      component.hide ||
      component.responsive?.hide?.includes(responsiveSize)
    )
      return [undefined, null];

    let props = { ...component.props, style: { ...component.style, ...style } };
    // use any responsive props
    const responsiveProps = component.responsive?.[responsiveSize]?.props;
    if (responsiveProps) props = { ...props, ...responsiveProps };

    // replace data for properties we know about
    if (type.properties) {
      // handle any special props
      Object.keys(props).forEach((prop) => {
        const property = type.properties[prop];
        if (Array.isArray(property)) {
          if (property[0] === '-color-')
            props[prop] = replaceWithData(props[prop], datum);
          else if (property.includes('-data-'))
            props[prop] = replaceWithData(props[prop], datum);
        } else if (typeof property === 'object') {
          // handle things like: background.color = ['-color-']
          props[prop] = { ...props[prop] };
          Object.keys(property).forEach((subProp) => {
            if (
              Array.isArray(property[subProp]) &&
              property[subProp][0] === '-color-'
            )
              props[prop][subProp] = replaceWithData(
                props[prop][subProp],
                datum,
              );
          });
        }
      });
    }

    // allow the type to adjust props if needed
    if (type.adjustProps)
      props = type.adjustProps(props, {
        component,
        datum,
        type,
        followLink,
        followLinkOption,
        rerender,
      });

    // render -component- and -Icon- properties
    if (type.properties) {
      // handle any special props
      Object.keys(props).forEach((prop) => {
        const property = type.properties[prop];
        // use designer Icon for icons
        if (
          Array.isArray(property) &&
          component.type !== 'designer.Icon' &&
          component.type !== 'Icon' &&
          property.includes('-Icon-')
        ) {
          // pass along size so we can adjust the icon size as well
          props[prop] = <Icon icon={props[prop]} size={props.size} />;
        }
        if (
          typeof property === 'string' &&
          property.startsWith('-component-') &&
          typeof props[prop] === 'number'
        ) {
          props[prop] = <DesignComponent id={props[prop]} datum={datum} />;
        }
      });
    }

    if (setSelection) {
      const propClick = props.onClick;
      props.onClick = (event) => {
        if (!clickBusy) {
          if (selection === id) {
            if (type.text) {
              setInlineEditSize(
                document.getElementById(id).getBoundingClientRect(),
              );
            }
          } else {
            setSelection(id);
          }
          // only change selection for the first design component
          clickBusy = true;
          setTimeout(() => {
            clickBusy = false;
          }, 2);
        }

        if (event.shiftKey) event.stopPropagation();
        else if (propClick) propClick(event);
        // if (event.shiftKey || !propClick) {
        //   // how to
        //   if (selection !== id) setSelection(id);
        //   else if (type.text)
        //     setInlineEditSize(
        //       document.getElementById(id).getBoundingClientRect(),
        //     );
        // } else if (propClick) propClick(event);
      };
      props.tabIndex = '-1';
      if (selection === id) {
        props.style = { ...(props.style || {}), outline: '1px dashed red' };
      }
    }

    let children;
    if (props?.children) {
      children = props.children;
      delete props.children;
    } else if (component.children?.length) {
      children = component.children
        // NOTE: I can't remember why we added this fitler, but it is
        // causing problems with toggling Layer visibility if we uncomment it.
        // .filter((childId) => {
        //   // Filter out hidden components.
        //   // We cannot detect if DesignComponent will render null at this point.
        //   const child = getComponent(childId);
        //   return child && !child.hide;
        // })
        .map((childId) => (
          <DesignComponent key={childId} id={childId} datum={datum} />
        ));
    } else if (inlineEditSize) {
      const useArea = type.name === 'Paragraph' || type.name === 'Markdown';
      children = (
        <InlineEditInput
          as={useArea ? 'textarea' : undefined}
          placeholder={type.text}
          defaultValue={component.text || ''}
          size={inlineEditSize}
          onChange={inlineEditOnChange}
          onDone={() => setInlineEditSize(undefined)}
        />
      );
    } else if (component.text || type.text) {
      children = replaceWithData(component.text || type.text, datum);
    } else if (type.placeholder) {
      children = <Placeholder>{type.placeholder(props)}</Placeholder>;
    }

    return [props, children];
  }, [
    component,
    datum,
    followLink,
    followLinkOption,
    id,
    inlineEditOnChange,
    inlineEditSize,
    responsiveSize,
    selection,
    setSelection,
    style,
    type,
  ]);

  useEffect(() => {
    const component = getComponent(id);
    if (component) {
      const type = getType(component.type);
      if (type.initialize)
        type.initialize(component.props, { component, followLinkOption });
    }
  }, [id, followLinkOption]);

  if (props === undefined) return renderNull;

  return { Component: type.component, props, children };
};

export default useDesignComponent;
