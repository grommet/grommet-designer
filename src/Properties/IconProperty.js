import React, { useEffect, useRef, useState } from 'react';
import { Button, Text } from 'grommet';
import { aliases, names, SelectLabel } from '../libraries/designer/Icon';
import ArrayProperty from './ArrayProperty';
import DataPathField from './DataPathField';

const IconProperty = React.forwardRef(({ name, onChange, value }, ref) => {
  const [focusDataPath, setFocusDataPath] = useState();
  const dpRef = useRef();

  useEffect(() => {
    if (focusDataPath) {
      dpRef.current.focus();
      setFocusDataPath(false);
    }
  }, [focusDataPath]);

  if (value === '' || value?.[0] === '{')
    return (
      <DataPathField
        ref={dpRef}
        name={name}
        onChange={onChange}
        value={value}
      />
    );

  return (
    <ArrayProperty
      ref={ref}
      name={name}
      Label={SelectLabel}
      options={names}
      value={value}
      searchTest={(option, searchExp) =>
        aliases &&
        aliases[option] &&
        aliases[option].filter((a) => searchExp.test(a)).length > 0
      }
      onChange={onChange}
    >
      {!value && (
        <Button
          icon={<Text color="text-weak">{'{}'}</Text>}
          onClick={() => {
            onChange('{}');
            setFocusDataPath(true);
          }}
        />
      )}
    </ArrayProperty>
  );
});

export default IconProperty;
