import React from 'react';
import { Box, Button, FormField, TextInput } from 'grommet';
import { Add, Trash } from 'grommet-icons';

export default ({ value, onChange }) => {
  return (
    <Box direction="row" gap="medium">
      {(value || [])
        .filter(item => item)
        .map((item, i) => (
          <Box basis="xsmall" flex="grow" key={i}>
            <Box flex="grow">
              <FormField label="label">
                <TextInput
                  value={item.label || ''}
                  onChange={event => {
                    const nextValue = JSON.parse(JSON.stringify(value));
                    nextValue[i].label = event.target.value;
                    onChange(nextValue);
                  }}
                />
              </FormField>
              <FormField label="value">
                <TextInput
                  value={item.value[1]}
                  onChange={event => {
                    const nextValue = JSON.parse(JSON.stringify(value));
                    nextValue[i].value = [i, parseInt(event.target.value, 10)];
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
                // prune empty values
                onChange(nextValue.filter(i => i));
              }}
            />
          </Box>
        ))}
      <Button
        icon={<Add />}
        hoverIndicator
        onClick={() => {
          const nextValue = JSON.parse(JSON.stringify(value || []));
          nextValue.push({ value: [] });
          onChange(nextValue);
        }}
      />
    </Box>
  );
};
