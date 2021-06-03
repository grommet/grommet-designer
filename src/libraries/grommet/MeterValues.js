import React from 'react';
import {
  Box,
  CheckBox,
  FormField,
  Select,
  Text,
  TextInput,
  ThemeContext,
} from 'grommet';
import ArrayOfObjects from './ArrayOfObjects';

const ColorLabel = ({ color, theme }) => (
  <Box pad="small" direction="row" gap="small" align="center">
    <ThemeContext.Extend value={theme}>
      <Box pad="small" background={color || undefined} />
    </ThemeContext.Extend>
    <Text weight="bold">{color}</Text>
  </Box>
);

const Value = ({ value, theme, onChange }) => {
  const baseTheme = React.useContext(ThemeContext);
  const [searchText, setSearchText] = React.useState('');
  const searchExp = searchText && new RegExp(searchText, 'i');
  const colors = Object.keys({
    ...baseTheme.global.colors,
    ...theme.global.colors,
  }).sort();

  return (
    <Box flex="grow" align="end">
      <Box flex="grow">
        <FormField label="value">
          <TextInput
            value={value.value !== undefined ? value.value : ''}
            onChange={(event) => {
              const nextValue = JSON.parse(JSON.stringify(value));
              nextValue.value =
                // allow for data references
                event.target.value === '{'
                  ? event.target.value
                  : parseInt(event.target.value, 10);
              // eslint-disable-next-line no-self-compare
              if (nextValue.value !== nextValue.value)
                // NaN check
                nextValue.value = undefined;
              onChange(nextValue);
            }}
          />
        </FormField>
        <FormField label="label">
          <TextInput
            value={value.label || ''}
            onChange={(event) => {
              const nextValue = JSON.parse(JSON.stringify(value));
              nextValue.label = event.target.value;
              onChange(nextValue);
            }}
          />
        </FormField>
        <FormField label="color">
          <Select
            plain
            id="color"
            name="color"
            options={
              searchExp
                ? [...colors.filter((c) => searchExp.test(c)), 'undefined']
                : [...colors, 'undefined']
            }
            value={value.color || ''}
            valueLabel={<ColorLabel color={value.color} theme={theme} />}
            onChange={({ option }) => {
              setSearchText(undefined);
              const nextValue = JSON.parse(JSON.stringify(value));
              nextValue.color = option === 'undefined' ? undefined : option;
              onChange(nextValue);
            }}
            onSearch={
              colors.length > 20
                ? (nextSearchText) => setSearchText(nextSearchText)
                : undefined
            }
          >
            {(option) => <ColorLabel color={option} theme={theme} />}
          </Select>
        </FormField>
        <FormField label="highlight">
          <Box pad="small">
            <CheckBox
              checked={value.highlight || false}
              onChange={(event) => {
                const nextValue = JSON.parse(JSON.stringify(value));
                nextValue.highlight = event.target.checked;
                onChange(nextValue);
              }}
            />
          </Box>
        </FormField>
      </Box>
    </Box>
  );
};

const MeterValues = (props) => (
  <ArrayOfObjects name="values" labelKey="value" Edit={Value} {...props} />
);

export default MeterValues;
