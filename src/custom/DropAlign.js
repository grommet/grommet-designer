import React from 'react';
import { Box, FormField, Select } from 'grommet';

export default ({ name, value, onChange }) => {
  return (
    <Box>
      {['top', 'bottom'].map(side => (
        <FormField key={side} label={side}>
          <Select
            options={['top', 'bottom', 'undefined']}
            value={(value || {})[side] || ''}
            onChange={({ option }) => {
              const nextValue = JSON.parse(JSON.stringify(value || {}));
              if (option === 'undefined') {
                delete nextValue[side];
              } else {
                nextValue[side] = option;
              }
              onChange(nextValue);
            }}
          />
        </FormField>
      ))}
      {['left', 'right'].map(side => (
        <FormField key={side} label={side}>
          <Select
            options={['left', 'right', 'undefined']}
            value={(value || {})[side] || ''}
            onChange={({ option }) => {
              const nextValue = JSON.parse(JSON.stringify(value || {}));
              if (option === 'undefined') {
                delete nextValue[side];
              } else {
                nextValue[side] = option;
              }
              onChange(nextValue);
            }}
          />
        </FormField>
      ))}
    </Box>
  );
}
