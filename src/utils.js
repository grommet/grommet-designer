export const getComponentType = (libraries, typeName) => {
  const [libraryName, componentName] = typeName.split('.');
  let component;
  libraries.some(({ name, components }) => {
    component = componentName
      ? libraryName === name && components[componentName]
      : components[typeName];
    return !!component;
  });
  return component || undefined;
};

export const displayName = component =>
  component.name ||
  component.text ||
  component.props.name ||
  component.props.label ||
  component.props.icon ||
  component.type.split('.')[1] ||
  component.type;

export const getReferenceDesign = (imports, referenceComponent) => {
  if (referenceComponent.props.design)
    return imports
      .filter(i => i.url === referenceComponent.props.design.url)
      .map(i => i.design)[0];
  return undefined;
};
