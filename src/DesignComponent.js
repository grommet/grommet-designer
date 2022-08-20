import { createElement } from 'react';
import useDesignComponent from './useDesignComponent';

// pass style so selection of a Reference shows the selection indicator
const DesignComponent = ({ id, datum, style }) => {
  const { Component, props, children } = useDesignComponent(id, datum, style);

  if (!Component) return null;

  return createElement(Component, { key: id, id: id, ...props }, children);
};

export default DesignComponent;
