import { bare } from './bare';

export const generateDesignName = () =>
  `${new Date().toLocaleDateString('default', {
    month: 'short',
    day: 'numeric',
  })} Design`;

export const setupDesign = (starter = bare) => {
  let nextId = 1;
  Object.keys(starter.screens).forEach(
    id => (nextId = Math.max(nextId, parseInt(id, 10))),
  );
  Object.keys(starter.components).forEach(
    id => (nextId = Math.max(nextId, parseInt(id, 10))),
  );
  nextId += 1;
  const name = starter.name || generateDesignName();
  return {
    ...starter,
    name,
    nextId,
    version: 2.0,
    created: new Date().toISOString(),
  };
};
