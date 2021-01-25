import React from 'react';
import { MaskedInput } from 'grommet';
import Field from '../components/Field';
import useDebounce from './useDebounce';

const NumberProperty = React.forwardRef(
  ({ first, name, onChange, sub, value: valueProp }, ref) => {
    const [value, setValue] = useDebounce(valueProp, onChange);
    return (
      <Field key={name} sub={sub} first={first} label={name} htmlFor={name}>
        <MaskedInput
          ref={ref}
          id={name}
          name={name}
          plain
          mask={[
            {
              regexp: /^\d*$/,
            },
          ]}
          value={value !== undefined ? value : ''}
          onChange={(event) => {
            const nextValue =
              event.target.value === ''
                ? undefined
                : parseInt(event.target.value, 10);
            setValue(nextValue);
          }}
          style={{ textAlign: 'end' }}
        />
      </Field>
    );
  },
);

export default NumberProperty;
