import React from 'react';
import {
  Box,
  Button,
  CheckBox,
  FormField,
  Select,
  Text,
  TextInput,
  ThemeContext,
} from 'grommet';
import { Add, Trash } from 'grommet-icons';

const ColorLabel = ({ color, theme }) => (
  <Box pad="small" direction="row" gap="small" align="center">
    <ThemeContext.Extend value={theme}>
      <Box pad="small" background={color || undefined} />
    </ThemeContext.Extend>
    <Text weight="bold">{color}</Text>
  </Box>
);

const MeterValues = ({ value, theme, onChange }) => {
  const baseTheme = React.useContext(ThemeContext);
  const [searchText, setSearchText] = React.useState('');
  const searchExp = searchText && new RegExp(searchText, 'i');
  const colors = Object.keys({
    ...baseTheme.global.colors,
    ...theme.global.colors,
  }).sort();

  return (
    <Box direction="row" gap="medium">
      {(value || []).map((item, i) => (
        <Box flex="grow" key={i}>
          <Box flex="grow">
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
                value={item.color || ''}
                valueLabel={<ColorLabel color={item.color} theme={theme} />}
                onChange={({ option }) => {
                  setSearchText(undefined);
                  const nextValue = JSON.parse(JSON.stringify(value));
                  nextValue[i].color =
                    option === 'undefined' ? undefined : option;
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
                  checked={item.highlight || false}
                  onChange={(event) => {
                    const nextValue = JSON.parse(JSON.stringify(value));
                    nextValue[i].highlight = event.target.checked;
                    onChange(nextValue);
                  }}
                />
              </Box>
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
            <FormField label="value">
              <TextInput
                value={item.value || ''}
                onChange={(event) => {
                  const nextValue = JSON.parse(JSON.stringify(value));
                  nextValue[i].value = parseInt(event.target.value, 10);
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
};

export default MeterValues;
