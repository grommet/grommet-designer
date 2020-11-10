import React from 'react';
import { Box, Button, FormField, TextInput } from 'grommet';
import { Add, Trash } from 'grommet-icons';

const DataChartSeries = ({ value, onChange, theme }) => {
  return (
    <Box direction="row" gap="medium">
      {(value || [])
        .filter((item) => item)
        .map((item, i) => (
          <Box basis="xsmall" flex="grow" key={i}>
            <Box flex="grow">
              <FormField label="property">
                <TextInput
                  value={item.property || ''}
                  onChange={(event) => {
                    const nextValue = JSON.parse(JSON.stringify(value));
                    nextValue[i].property = event.target.value;
                    onChange(nextValue);
                  }}
                />
              </FormField>
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
              <FormField label="prefix">
                <TextInput
                  value={item.prefix || ''}
                  onChange={(event) => {
                    const nextValue = JSON.parse(JSON.stringify(value));
                    nextValue[i].prefix = event.target.value;
                    onChange(nextValue);
                  }}
                />
              </FormField>
              <FormField label="suffix">
                <TextInput
                  value={item.suffix || ''}
                  onChange={(event) => {
                    const nextValue = JSON.parse(JSON.stringify(value));
                    nextValue[i].suffix = event.target.value;
                    onChange(nextValue);
                  }}
                />
              </FormField>
            </Box>
            <Button
              icon={<Trash />}
              onClick={() => {
                const nextValue = JSON.parse(JSON.stringify(value));
                nextValue.splice(i, 1);
                // prune empty values
                onChange(nextValue.filter((i) => i));
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
};

export default DataChartSeries;
