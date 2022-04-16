import { createElement } from 'react';
import useDesignComponent from './useDesignComponent';

const DesignComponent = ({ id }) => {
  const { Component, props, children } = useDesignComponent(id);

  if (!Component) return null;

  return createElement(Component, { key: id, id: id, ...props }, children);
};

export default DesignComponent;
