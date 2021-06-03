import React from 'react';
import { Box, CheckBox, FormField, Select, TextInput } from 'grommet';
import { ThemeContext } from 'styled-components';
import ArrayOfObjects from './ArrayOfObjects';

const Chart = ({ value, onChange, theme }) => {
  const baseTheme = React.useContext(ThemeContext);
  const colorOptions = React.useMemo(() => {
    const merged = { ...baseTheme.global.colors, ...theme.global.colors };
    const names = Object.keys(merged).sort();
    names.push('undefined');
    return names;
  }, [baseTheme.global.colors, theme.global.colors]);
  return (
    <Box flex="grow" align="end">
      <Box flex="grow">
        <FormField
          label="property"
          help={value.type === 'bars' ? 'space separated for multiple' : ''}
        >
          <TextInput
            value={
              value.type === 'bars'
                ? value.property.join(' ')
                : value.property || ''
            }
            onChange={(event) => {
              const nextValue = JSON.parse(JSON.stringify(value));
              nextValue.property =
                value.type === 'bars'
                  ? event.target.value.split(' ')
                  : event.target.value;
              onChange(nextValue);
            }}
          />
        </FormField>
        <FormField label="type">
          <Select
            options={['bar', 'bars', 'area', 'line', 'point', 'undefined']}
            value={value.type}
            onChange={({ option }) => {
              const nextValue = JSON.parse(JSON.stringify(value));
              if (option === 'undefined') delete nextValue.type;
              else nextValue.type = option;
              if (option === 'bars') {
                if (typeof value.property === 'string') {
                  nextValue.property = value.property.split(' ');
                }
              } else if (Array.isArray(value.property)) {
                nextValue.property = value.property[0] || '';
              }
              onChange(nextValue);
            }}
          />
        </FormField>
        {value.type === 'point' && (
          <FormField label="point">
            <Select
              options={[
                'circle',
                'diamond',
                'square',
                'star',
                'triangle',
                'triangleDown',
              ]}
              value={value.point}
              onChange={({ option }) => {
                const nextValue = JSON.parse(JSON.stringify(value));
                if (option === 'undefined') delete nextValue.point;
                else nextValue.point = option;
                onChange(nextValue);
              }}
            />
          </FormField>
        )}
        <FormField label="color">
          <Select
            options={colorOptions}
            value={value.color || ''}
            onChange={({ option }) => {
              const nextValue = JSON.parse(JSON.stringify(value));
              if (option === 'undefined') delete nextValue.color;
              else nextValue.color = option;
              onChange(nextValue);
            }}
          />
        </FormField>
        <FormField label="opacity">
          <Select
            options={['weak', 'medium', 'strong', 'undefined']}
            value={value.opacity || ''}
            onChange={({ option }) => {
              const nextValue = JSON.parse(JSON.stringify(value));
              if (option === 'undefined') delete nextValue.opacity;
              else nextValue.opacity = option;
              onChange(nextValue);
            }}
          />
        </FormField>
        <FormField label="thickness">
          <Select
            options={[
              'hair',
              'xsmall',
              'small',
              'medium',
              'large',
              'xlarge',
              'undefined',
            ]}
            value={value.thickness || ''}
            onChange={({ option }) => {
              const nextValue = JSON.parse(JSON.stringify(value));
              if (option === 'undefined') delete nextValue.thickness;
              else nextValue.thickness = option;
              onChange(nextValue);
            }}
          />
        </FormField>
        <FormField>
          <CheckBox
            label="dash"
            checked={value.dash}
            onChange={(event) => {
              const nextValue = JSON.parse(JSON.stringify(value));
              nextValue.dash = event.target.checked;
              onChange(nextValue);
            }}
          />
        </FormField>
        <FormField>
          <CheckBox
            label="round"
            checked={value.round}
            onChange={(event) => {
              const nextValue = JSON.parse(JSON.stringify(value));
              nextValue.round = event.target.checked;
              onChange(nextValue);
            }}
          />
        </FormField>
      </Box>
    </Box>
  );
};

// convert array of strings to be an object for editing, back if can be
const DataChartChart = ({ value = [], onChange, ...rest }) => (
  <ArrayOfObjects
    value={value.map((v) => (typeof v === 'string' ? { property: v } : v))}
    name="series"
    labelKey="property"
    Edit={Chart}
    onChange={(nextValue) =>
      onChange(
        nextValue.map((v) => (Object.keys(v).length === 1 ? v.property : v)),
      )
    }
    {...rest}
  />
);

export default DataChartChart;
