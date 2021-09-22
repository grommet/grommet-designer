import { useCallback, useEffect, useState } from 'react';

// Performs updates from Properties but accomodates updates from Canvas.
const useDebounce = (valueProp, onChange) => {
  const [value, setValue] = useState(valueProp);

  // setting tracks when we're between setValue() and onChange().
  // When the user is typing, we set it to true. When he stops typing and
  // we call onChange, we clear it.
  // When the user changes the value from the Canvas, we'll update our
  // value if setting isn't true.
  // This is so we don't throw out subsequent characters that user has typed
  // since we called onChange() but haven't received it via valueProp yet.
  const [setting, setSetting] = useState(false);

  const set = useCallback((nextValue) => {
    setSetting(true);
    setValue(nextValue);
  }, []);

  useEffect(() => {
    if (!setting) setValue(valueProp);
  }, [setting, valueProp]);

  useEffect(() => {
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
