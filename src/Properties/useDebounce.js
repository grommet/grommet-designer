import React from 'react';

export default (componentId, valueProp, onChange) => {
  const [value, setValue] = React.useState(valueProp);
  const [previousId, setPreviousId] = React.useState(componentId);
  React.useEffect(() => {
    // if the component changes, just update our value
    if (componentId !== previousId) {
      setValue(valueProp);
      setPreviousId(componentId);
      return undefined;
    }
    if (value !== valueProp) {
      // lazily update, so we don't slow down typing
      const timer = setTimeout(() => onChange(value), 500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [componentId, onChange, previousId, value, valueProp]);
  return [value, setValue];
};
