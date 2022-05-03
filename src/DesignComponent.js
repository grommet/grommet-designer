import { createElement } from 'react';
import useDesignComponent from './useDesignComponent';

const DesignComponent = ({ id, datum }) => {
  const { Component, props, children } = useDesignComponent(id, datum);

  if (!Component) return null;

  return createElement(Component, { key: id, id: id, ...props }, children);
};

export default DesignComponent;
