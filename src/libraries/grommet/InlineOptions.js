import React from 'react';
import { RadioButtonGroup } from 'grommet';

const InlineOptions = ({ children, name, options, value, onChange }) => {
  return (
    <RadioButtonGroup
      id={name}
      name={name}
      direction="row"
      gap="none"
      margin={{ horizontal: 'small' }}
      options={options.map(o => ({ value: o, id: `${name}-${o}` }))}
      value={typeof value === 'boolean' ? value.toString() : value || ''}
      onChange={event => {
        const option = event.target.value;
        onChange(option === 'undefined' ? undefined : option);
      }}
    >
      {(option, state) => children(option.value, state)}
    </RadioButtonGroup>
  );
};

export default InlineOptions;
