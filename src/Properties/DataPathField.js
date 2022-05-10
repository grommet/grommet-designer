import React, { forwardRef, useState } from 'react';
import { Button, TextInput } from 'grommet';
import { Trash } from 'grommet-icons';
import Field from '../components/Field';

const DataPathField = forwardRef(({ name, onChange, value }, ref) => {
  const [dataPath, setDataPath] = useState(value);

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
        icon={<Trash />}
        onClick={() => {
          setDataPath(undefined);
          onChange(undefined);
        }}
      />
    </Field>
  );
});

export default DataPathField;
