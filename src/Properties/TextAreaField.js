import React from 'react';
import { TextArea } from 'grommet';
import Field from '../components/Field';
import useDebounce from './useDebounce';

export default ({ onChange, name, value: valueProp }) => {
  const [value, setValue] = useDebounce(valueProp, onChange);
  return (
    <Field label={name} htmlFor={name}>
      <TextArea
        id={name}
        name={name}
        plain
        value={value}
        onChange={event => setValue(event.target.value)}
        style={{ textAlign: 'end' }}
      />
    </Field>
  );
};
