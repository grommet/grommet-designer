import React from 'react';
import { Box, FormField, TextInput } from 'grommet';
import ArrayOfObjects from './ArrayOfObjects';

const Series = ({ value, onChange }) => {
  const setField = (name, fieldValue) => {
    const nextValue = JSON.parse(JSON.stringify(value));
    if (fieldValue) nextValue[name] = fieldValue;
    else delete nextValue[name];
    onChange(nextValue);
  };

  return (
    <Box flex="grow" align="end">
      <Box flex="grow">
        <FormField label="property">
          <TextInput
            value={value.property || ''}
            onChange={(event) => setField('property', event.target.value)}
          />
        </FormField>
        <FormField label="label">
          <TextInput
            value={value.label || ''}
            onChange={(event) => setField('label', event.target.value)}
          />
        </FormField>
        <FormField label="prefix">
          <TextInput
            value={value.prefix || ''}
            onChange={(event) => setField('prefix', event.target.value)}
          />
        </FormField>
        <FormField label="suffix">
          <TextInput
            value={value.suffix || ''}
            onChange={(event) => setField('suffix', event.target.value)}
          />
        </FormField>
      </Box>
    </Box>
  );
};

// convert array of strings to be an object for editing, back if can be
const DataChartSeries = ({ value = [], onChange, ...rest }) => (
  <ArrayOfObjects
    value={value.map((v) => (typeof v === 'string' ? { property: v } : v))}
    name="series"
    labelKey="property"
    Edit={Series}
    onChange={(nextValue) =>
      onChange(
        nextValue.map((v) => (Object.keys(v).length === 1 ? v.property : v)),
      )
    }
    {...rest}
  />
);

export default DataChartSeries;
