import React, { useContext } from 'react';
import styled from 'styled-components';
import { ResponsiveContext } from 'grommet';
import Icon from './libraries/designer/Icon';
import DesignContext from './Design2Context';
import SelectionContext from './SelectionContext';
import DesignComponent from './DesignComponent';

const renderNull = {};

const Placeholder = styled.div`
  pointer-events: none;
`;

const useDesignComponent = (id) => {
  const { getComponent, getType, mode } = useContext(DesignContext);
  const { component: selectionComponent, setSelection } =
    useContext(SelectionContext);
  const responsiveSize = useContext(ResponsiveContext);

  // get component definition in the design
  let component = getComponent(id);
  if (!component) return renderNull;

  // don't render if hiding at this size
  if (component.hide || component.responsive?.hide?.includes(responsiveSize))
    return renderNull;

  let props = { ...component.props };
  // use any responsive props
  const responsiveProps = component.responsive?.[responsiveSize]?.props;
  if (responsiveProps) props = { ...props, ...responsiveProps };

  const type = getType(component.type);
  if (!type) return renderNull;

  // TODO: handle Reference and Repeater

  // allow the type to adjust props if needed
  if (type.adjustProps) props = type.adjustProps(props, { component, type });

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
        !props[prop]
      ) {
        props[prop] = <DesignComponent id={props[prop]} />;
      }
    });
  }

  // TODO: inline edit
  if (mode === 'edit') {
    props.onClick = (event) => {
      event.stopPropagation();
      if (selectionComponent !== component) {
        // setInlineEdit(undefined);
        setSelection({ component: id });
        // } else if (type.text && !referenceDesign && selectedRef.current) {
        //   setInlineEditSize(selectedRef.current.getBoundingClientRect());
        //   setInlineEdit(id);
      }
      if (props.onClick) props.onClick(event);
    };
    props.tabIndex = '-1';
  }

  // render children
  let children;
  if (props?.children) {
    children = props.children;
    delete props.children;
  } else if (component.children?.length) {
    children = component.children.map((childId) => (
      <DesignComponent id={childId} />
    ));
  } else if (component.text || type.text) {
    // TODO: handle replacing with data
    children = component.text || type.text;
  } else if (type.placeholder && !component.coupled) {
    children = <Placeholder>{type.placeholder(props)}</Placeholder>;
  }

  return { Component: type.component, props, children };
};

export default useDesignComponent;
