import React, { useContext, useMemo, useState } from 'react';
import { Box, CheckBox, FormField, Select, Text, TextInput } from 'grommet';
import { ThemeContext } from 'styled-components';
import { getTheme } from '../../design2';
import ArrayOfObjects from './ArrayOfObjects';

const ShareableFields = ({ value, onChange }) => {
  const set = (name, valueArg) => {
    const nextValue = JSON.parse(JSON.stringify(value));
    if (valueArg === 'undefined') delete nextValue[name];
    else nextValue[name] = valueArg;
    onChange(nextValue);
  };

  return (
    <>
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
          onChange={(event) => set('dash', event.target.checked)}
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

const PropertyFields = ({ value, onChange, type }) => {
  const baseTheme = useContext(ThemeContext);
  const theme = getTheme();

  // search for colors
  const [searchText, setSearchText] = useState('');
  const searchExp = useMemo(
    () => searchText && new RegExp(`${searchText}`, 'i'),
    [searchText],
  );

  const colorOptions = useMemo(() => {
    const merged = { ...baseTheme.global.colors, ...theme.global.colors };
    const names = Object.keys(merged)
      .sort()
      .filter((n) => !searchExp || searchExp.test(n));
    if (value.color) names.push('undefined');
    return names;
  }, [baseTheme.global.colors, theme.global.colors, searchExp, value]);

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
          onChange={({ option }) => {
            setSearchText(undefined);
            set('color', option);
          }}
          onSearch={(nextSearchText) => setSearchText(nextSearchText)}
        />
      </FormField>
      <FormField label="opacity">
        <Select
          options={['weak', 'medium', 'strong', 'undefined']}
          value={value.opacity || ''}
          onChange={({ option }) => set('opacity', option)}
        />
      </FormField>
      <ShareableFields value={value} onChange={onChange} type={type} />
    </>
  );
};

const Chart = ({ value, onChange }) => {
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
            'lines',
            'point',
            'undefined',
          ]}
          value={value.type}
          onChange={({ option }) => {
            const nextValue = JSON.parse(JSON.stringify(value));
            if (option === 'undefined') delete nextValue.type;
            else nextValue.type = option;
            if (option === 'bars' || option === 'areas' || option === 'lines') {
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
      {value.type === 'bars' ||
      value.type === 'areas' ||
      value.type === 'lines' ? (
        <>
          <Text margin={{ start: 'small' }}>property</Text>
          <Box
            flex={false}
            pad={{ left: 'medium', bottom: 'small', top: 'small' }}
            margin={{ bottom: 'small' }}
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
            />
          </Box>
          <ShareableFields
            value={value}
            onChange={onChange}
            type={value.type}
          />
        </>
      ) : (
        <PropertyFields value={value} onChange={onChange} type={value.type} />
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
