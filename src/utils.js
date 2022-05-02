// TODO: remove
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

export const getReferenceDesign = (imports, referenceComponent) => {
  if (referenceComponent.props.design)
    return imports
      .filter((i) => i.url === referenceComponent.props.design.url)
      .map((i) => i.design)[0];
  return undefined;
};

export const parseUrlParams = (url) => {
  const params = {};
  (url.split('?')[1] || '').split('&').forEach((p) => {
    const [k, v] = p.split('=');
    params[k] = decodeURIComponent(v);
  });
  return params;
};
