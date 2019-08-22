import React from 'react';
import { Box, FormField, TextInput } from 'grommet';

export default ({ value, onChange }) => {
  const normalizedValue = value || [[0, 10], [0, 100]];
  return (
    <Box>
      <FormField label="minX">
        <TextInput
          value={normalizedValue[0][0]}
          onChange={(event) => {
            const nextValue = JSON.parse(JSON.stringify(normalizedValue));
            nextValue[0][0] = parseInt(event.target.value, 10);
            onChange(nextValue);
          }}
        />
      </FormField>
      <FormField label="maxX">
        <TextInput
          value={normalizedValue[0][1]}
          onChange={(event) => {
            const nextValue = JSON.parse(JSON.stringify(normalizedValue));
            nextValue[0][1] = parseInt(event.target.value, 10);
            onChange(nextValue);
          }}
        />
      </FormField>
      <FormField label="minY">
        <TextInput
          value={normalizedValue[1][0]}
          onChange={(event) => {
            const nextValue = JSON.parse(JSON.stringify(normalizedValue));
            nextValue[1][0] = parseInt(event.target.value, 10);
            onChange(nextValue);
          }}
        />
      </FormField>
      <FormField label="maxY">
        <TextInput
          value={normalizedValue[1][1]}
          onChange={(event) => {
            const nextValue = JSON.parse(JSON.stringify(normalizedValue));
            nextValue[1][1] = parseInt(event.target.value, 10);
            onChange(nextValue);
          }}
        />
      </FormField>
    </Box>
  );
}
