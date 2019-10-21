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
