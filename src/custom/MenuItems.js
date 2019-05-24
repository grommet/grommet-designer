import React from 'react';
import { Box, Button, FormField, TextInput } from 'grommet';
import { Add, Trash } from 'grommet-icons';

export default ({ value, onChange }) => (
  <Box direction="row" gap="medium">
    {(value || []).map((item, i) => (
      <Box flex="grow" key={i}>
        <Box flex="grow">
          <FormField label="label">
            <TextInput
              value={item.label || ''}
              onChange={(event) => {
                const nextValue = JSON.parse(JSON.stringify(value));
                nextValue[i].label = event.target.value;
                onChange(nextValue);
              }}
            />
          </FormField>
        </Box>
        <Button
          icon={<Trash />}
          onClick={() => {
            const nextValue = JSON.parse(JSON.stringify(value));
            delete nextValue[i];
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
        nextValue.push({});
        onChange(nextValue);
      }}
    />
  </Box>
);
