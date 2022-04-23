import React from 'react';
import { Box, TextInput } from 'grommet';
import Field from '../components/Field';
import useDebounce from '../useDebounce';
import ComponentInput from './ComponentInput';

const StringOrComponentProperty = React.forwardRef(
  (
    { componentId, name, onChange, value: valueProp, ...rest },
    ref,
  ) => {
    const [value, setValue] = useDebounce(valueProp, onChange);
    return (
      <Field key={name} label={name} htmlFor={name}>
        <Box direction="row" gap="small">
          <ComponentInput
            componentId={componentId}
            name={name}
            value={value}
            onChange={onChange}
            {...rest}
          />
          {typeof value !== 'number' && (
            <TextInput
              ref={ref}
              id={name}
              name={name}
              plain
              value={value || ''}
              onChange={(event) => setValue(event.target.value)}
              style={{ textAlign: 'end' }}
            />
          )}
        </Box>
      </Field>
    );
  },
);

export default StringOrComponentProperty;
