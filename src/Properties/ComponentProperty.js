import React from 'react';
import Field from '../components/Field';
import ComponentInput from './ComponentInput';

const ComponentProperty = React.forwardRef(
  ({ componentId, first, name, onChange, sub, value, ...rest }, ref) => {
    return (
      <Field key={name} sub={sub} first={first} label={name} htmlFor={name}>
        <ComponentInput
          componentId={componentId}
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
