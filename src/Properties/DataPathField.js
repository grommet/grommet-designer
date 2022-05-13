import React, { forwardRef, useEffect, useState } from 'react';
import { Button, TextInput } from 'grommet';
import { FormClose } from 'grommet-icons';
import Field from '../components/Field';

const DataPathField = forwardRef(({ name, onChange, value }, ref) => {
  const [dataPath, setDataPath] = useState(value);

  useEffect(() => {
    if (document.activeElement === ref.current)
      ref.current.setSelectionRange(1, 1);
  }, [ref]);

  return (
    <Field label={name} htmlFor={name}>
      <TextInput
        ref={ref}
        id={name}
        name={name}
        plain
        value={dataPath}
        onChange={(event) => {
          const { value: nextValue } = event.target;
          setDataPath(nextValue);
          if (nextValue[0] === '{') onChange(nextValue);
        }}
        style={{ textAlign: 'end' }}
      />

      <Button
        icon={<FormClose />}
        onClick={() => {
          setDataPath(undefined);
          onChange(undefined);
        }}
      />
    </Field>
  );
});

export default DataPathField;
