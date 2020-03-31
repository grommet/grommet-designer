import React from 'react';
import { Box, Button, FormField, TextInput } from 'grommet';
import { Add, Trash } from 'grommet-icons';

export default ({ design, selected, value, onChange }) => {
  return (
    <Box gap="medium">
      {(value || []).map((item, i) => (
        <Box key={i} direction="row" flex="grow">
          <FormField>
            <TextInput
              value={item || ''}
              onChange={event => {
                const nextValue = JSON.parse(JSON.stringify(value));
                nextValue[i] = event.target.value;
                onChange(nextValue);
              }}
            />
          </FormField>
          <Button
            icon={<Trash />}
            onClick={() => {
              const nextValue = JSON.parse(JSON.stringify(value));
              nextValue.splice(i, 1);
              onChange(nextValue);
            }}
          />
        </Box>
      ))}
      <Button
        icon={<Add />}
        hoverIndicator
        onClick={() => {
          const nextValue = JSON.parse(JSON.stringify(value || []));
          nextValue.push('');
          onChange(nextValue);
        }}
      />
    </Box>
  );
};
