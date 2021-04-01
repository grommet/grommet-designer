import React from 'react';

const useDebounce = (valueProp, onChange) => {
  const [value, setValue] = React.useState(valueProp);

  // setting tracks when we're between setValue() and onChange().
  // When the user is typing, we set it to true. When he stops typing and
  // we call onChange, we clear it.
  // When the user changes the valueProp, we'll update our
  // value only if setting isn't true.
  // This is so we don't throw out subsequent characters that the user has typed
  // since we called onChange() but haven't received via valueProp yet.
  const [setting, setSetting] = React.useState(false);
  React.useEffect(() => {
    if (!setting) setValue(valueProp);
  }, [setting, valueProp]);

  const set = React.useCallback((nextValue) => {
    setSetting(true);
    setValue(nextValue);
  }, []);

  React.useEffect(() => {
    if (value !== valueProp && setting) {
      // lazily update, so we don't slow down typing
      const timer = setTimeout(() => {
        onChange(value);
        setSetting(false);
      }, 500); // 500, just empirical
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [onChange, setting, value, valueProp]);
  return [value, set];
};

export default useDebounce;
