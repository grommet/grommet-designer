export const serialize = (design, selected) => {
  const result = { components: {} };

  const addComponent = id => {
    const component = design.components[id];
    result.components[id] = component;
    if (component.children) {
      component.children.forEach(i => addComponent(i));
    }
  };

  addComponent(selected.component);

  return JSON.stringify({ design: result, selected });
};
