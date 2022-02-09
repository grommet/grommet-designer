import React from 'react';
import { Box, CheckBox, FormField, Select, TextInput } from 'grommet';
import { ThemeContext } from 'styled-components';
import ArrayOfObjects from './ArrayOfObjects';

const PropertyFields = ({ value, onChange, theme, type }) => {
  const baseTheme = React.useContext(ThemeContext);
  const colorOptions = React.useMemo(() => {
    const merged = { ...baseTheme.global.colors, ...theme.global.colors };
    const names = Object.keys(merged).sort();
    names.push('undefined');
    return names;
  }, [baseTheme.global.colors, theme.global.colors]);

  const set = (name, valueArg) => {
    const nextValue = JSON.parse(JSON.stringify(value));
    if (valueArg === 'undefined') delete nextValue[name];
    else nextValue[name] = valueArg;
    onChange(nextValue);
  };

  return (
    <>
      <FormField label="property">
        <TextInput
          value={value.property || ''}
          onChange={(event) => set('property', event.target.value)}
        />
      </FormField>
      {type === 'point' && (
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
            onChange={({ option }) => set('point', option)}
          />
        </FormField>
      )}
      <FormField label="color">
        <Select
          options={colorOptions}
          value={value.color || ''}
          onChange={({ option }) => set('color', option)}
        />
      </FormField>
      <FormField label="opacity">
        <Select
          options={['weak', 'medium', 'strong', 'undefined']}
          value={value.opacity || ''}
          onChange={({ option }) => set('opacity', option)}
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
          onChange={({ option }) => set('thickness', option)}
        />
      </FormField>
      <FormField>
        <CheckBox
          label="dash"
          checked={value.dash}
          onChange={(event) => set('thickness', event.target.checked)}
        />
      </FormField>
      <FormField>
        <CheckBox
          label="round"
          checked={value.round}
          onChange={(event) => set('round', event.target.checked)}
        />
      </FormField>
    </>
  );
};

const Chart = ({ value, onChange, theme }) => {
  return (
    <Box flex="grow" align="stretch" margin={{ bottom: 'medium' }}>
      <FormField label="type">
        <Select
          options={[
            'bar',
            'bars',
            'area',
            'areas',
            'line',
            'point',
            'undefined',
          ]}
          value={value.type}
          onChange={({ option }) => {
            const nextValue = JSON.parse(JSON.stringify(value));
            if (option === 'undefined') delete nextValue.type;
            else nextValue.type = option;
            if (option === 'bars' || option === 'areas') {
              if (typeof value.property === 'string') {
                nextValue.property = [{ property: value.property }];
              }
            } else if (Array.isArray(value.property)) {
              nextValue.property = value.property[0].property || '';
            }
            onChange(nextValue);
          }}
        />
      </FormField>
      {value.type === 'bars' || value.type === 'areas' ? (
        <Box
          flex="grow"
          pad={{ left: 'medium', bottom: 'medium', top: 'small' }}
          border="bottom"
        >
          <ArrayOfObjects
            value={value.property}
            name="property"
            labelKey="property"
            Edit={PropertyFields}
            onChange={(nextProperty) => {
              const nextValue = JSON.parse(JSON.stringify(value));
              nextValue.property = nextProperty;
              onChange(nextValue);
            }}
            type={value.type}
            theme={theme}
          />
        </Box>
      ) : (
        <PropertyFields
          value={value}
          onChange={onChange}
          type={value.type}
          theme={theme}
        />
      )}
    </Box>
  );
};

// convert array of strings to be an object for editing, back if can be
const DataChartChart = ({ value = [], onChange, ...rest }) => (
  <ArrayOfObjects
    value={value.map((v) => (typeof v === 'string' ? { property: v } : v))}
    name="chart"
    labelKey={
      value.find((v) => Array.isArray(v.property)) ? 'type' : 'property'
    }
    Edit={Chart}
    onChange={onChange}
    {...rest}
  />
);

export default DataChartChart;
