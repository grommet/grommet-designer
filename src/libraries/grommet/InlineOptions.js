import React, { useMemo } from 'react';
import { RadioButtonGroup } from 'grommet';

const InlineOptions = ({ children, name, options, value, onChange, gap }) => {
  const buttonGroupOptions = useMemo(
    () =>
      options.map(o => {
        const label = o.label || o;
        let val = o.domValue || o.value || o;
        if (typeof val === 'boolean') val = val.toString();
        return { label, value: val, id: `${name}-${label}` };
      }),
    [name, options],
  );
  const valueIndex = options.findIndex(
    o => (typeof o === 'object' ? o.value : o) === value,
  );
  const buttonGroupOption = buttonGroupOptions[valueIndex];

  return (
    <RadioButtonGroup
      id={name}
      name={name}
      direction="row"
      gap={gap || 'none'}
      margin={{ horizontal: 'small' }}
      options={buttonGroupOptions}
      value={buttonGroupOption ? buttonGroupOption.value : ''}
      onChange={event => {
        const index = buttonGroupOptions.findIndex(
          o => o.value === event.target.value,
        );
        const option = options[index];
        onChange(typeof option === 'object' ? option.value : option);
      }}
    >
      {(option, state) => children(option, state)}
    </RadioButtonGroup>
  );
};

export default InlineOptions;
