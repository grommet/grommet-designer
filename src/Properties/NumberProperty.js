import React from 'react';
import { MaskedInput } from 'grommet';
import Field from '../components/Field';
import useDebounce from '../useDebounce';

const NumberProperty = React.forwardRef(
  ({ name, onChange, value: valueProp }, ref) => {
    const [value, setValue] = useDebounce(valueProp, onChange);
    return (
      <Field key={name} label={name} htmlFor={name}>
        <MaskedInput
          ref={ref}
          id={name}
          name={name}
          plain
          mask={[
            {
              regexp: /^-?\d*$|^\{|^\{.+/,
            },
          ]}
          value={value !== undefined && value !== null ? value : ''}
          onChange={(event) => {
            let nextValue;
            // data reference
            if (event.target.value[0] === '{') nextValue = event.target.value;
            else if (event.target.value === '-') nextValue = event.target.value;
            else {
              nextValue = parseInt(event.target.value, 10);
              // NaN check
              // eslint-disable-next-line no-self-compare
              if (nextValue !== nextValue) nextValue = undefined;
            }
            setValue(nextValue);
          }}
          style={{ textAlign: 'end' }}
        />
      </Field>
    );
  },
);

export default NumberProperty;
