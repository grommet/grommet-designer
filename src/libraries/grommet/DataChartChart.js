import React from 'react';
import { Box, Button, CheckBox, FormField, Select, TextInput } from 'grommet';
import { Add, Trash } from 'grommet-icons';
import { ThemeContext } from 'styled-components';

const DataChartChart = ({ value, onChange, theme }) => {
  const baseTheme = React.useContext(ThemeContext);
  const colorOptions = React.useMemo(() => {
    const merged = { ...baseTheme.global.colors, ...theme.global.colors };
    const names = Object.keys(merged).sort();
    names.push('undefined');
    return names;
  }, [baseTheme.global.colors, theme.global.colors]);
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
              <FormField label="type">
                <Select
                  options={['bar', 'area', 'line', 'point', 'undefined']}
                  value={item.type}
                  onChange={({ option }) => {
                    const nextValue = JSON.parse(JSON.stringify(value));
                    if (option === 'undefined') delete nextValue[i].type;
                    else nextValue[i].type = option;
                    onChange(nextValue);
                  }}
                />
              </FormField>
              {item.type === 'point' && (
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
                    value={item.point}
                    onChange={({ option }) => {
                      const nextValue = JSON.parse(JSON.stringify(value));
                      if (option === 'undefined') delete nextValue[i].point;
                      else nextValue[i].point = option;
                      onChange(nextValue);
                    }}
                  />
                </FormField>
              )}
              <FormField label="color">
                <Select
                  options={colorOptions}
                  value={item.color || ''}
                  onChange={({ option }) => {
                    const nextValue = JSON.parse(JSON.stringify(value));
                    if (option === 'undefined') delete nextValue[i].color;
                    else nextValue[i].color = option;
                    onChange(nextValue);
                  }}
                />
              </FormField>
              <FormField label="opacity">
                <Select
                  options={['weak', 'medium', 'strong', 'undefined']}
                  value={item.opacity || ''}
                  onChange={({ option }) => {
                    const nextValue = JSON.parse(JSON.stringify(value));
                    if (option === 'undefined') delete nextValue[i].opacity;
                    else nextValue[i].opacity = option;
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
                  value={item.thickness || ''}
                  onChange={({ option }) => {
                    const nextValue = JSON.parse(JSON.stringify(value));
                    if (option === 'undefined') delete nextValue[i].thickness;
                    else nextValue[i].thickness = option;
                    onChange(nextValue);
                  }}
                />
              </FormField>
              <FormField>
                <CheckBox
                  label="dash"
                  checked={item.dash}
                  onChange={(event) => {
                    const nextValue = JSON.parse(JSON.stringify(value));
                    nextValue[i].dash = event.target.checked;
                    onChange(nextValue);
                  }}
                />
              </FormField>
              <FormField>
                <CheckBox
                  label="round"
                  checked={item.round}
                  onChange={(event) => {
                    const nextValue = JSON.parse(JSON.stringify(value));
                    nextValue[i].round = event.target.checked;
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

export default DataChartChart;
