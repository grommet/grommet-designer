import React from 'react';
import { TextInput } from 'grommet';
import Field from '../components/Field';
import useDebounce from '../useDebounce';

const StringProperty = React.forwardRef(
  ({ name, onChange, value: valueProp }, ref) => {
    const [value, setValue] = useDebounce(valueProp, onChange);
    return (
      <Field key={name} label={name} htmlFor={name}>
        <TextInput
          ref={ref}
          id={name}
          name={name}
          plain
          value={value || ''}
          onChange={(event) => setValue(event.target.value)}
          style={{ textAlign: 'end' }}
        />
      </Field>
    );
  },
);

export default StringProperty;
