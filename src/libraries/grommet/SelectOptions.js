import React from 'react';
import { Box, Button, FormField, TextInput } from 'grommet';
import { Add, Trash } from 'grommet-icons';

const SelectOptions = ({ design, selected, value, onChange }) => {
  return (
    <Box gap="medium">
      {(value || []).map((item, i) => (
        <Box key={i} direction="row" flex="grow">
          <FormField>
            <TextInput
              value={item || ''}
              onChange={(event) => {
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
          // start with a reasonable value, we do this so components like
          // CheckBoxGroup don't have duplicate key issues
          let suffix = 1;
          while (nextValue.includes(`option ${suffix}`)) suffix += 1;
          nextValue.push(`option ${suffix}`);
          onChange(nextValue);
        }}
      />
    </Box>
  );
};

export default SelectOptions;
