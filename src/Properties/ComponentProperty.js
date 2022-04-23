import React from 'react';
import Field from '../components/Field';
import ComponentInput from './ComponentInput';

const ComponentProperty = React.forwardRef(
  ({ name, onChange, value, ...rest }, ref) => {
    return (
      <Field key={name} label={name} htmlFor={name}>
        <ComponentInput
          name={name}
          value={value}
          onChange={onChange}
          {...rest}
        />
      </Field>
    );
  },
);

export default ComponentProperty;
