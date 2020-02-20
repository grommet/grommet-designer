import React from 'react';
import { TextArea } from 'grommet';
import Field from '../components/Field';

export default ({ onChange, name, value: valueProp }) => {
  const [value, setValue] = React.useState(valueProp || '');
  React.useEffect(() => setValue(valueProp || ''), [valueProp]);
  // lazily update, so we don't slow down typing
  React.useEffect(() => {
    if (value === valueProp) return undefined;
    const timer = setTimeout(() => onChange(value), 500);
    return () => clearTimeout(timer);
  }, [onChange, value, valueProp]);

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
