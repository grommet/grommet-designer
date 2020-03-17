import React from 'react';
import { Box, Button, CheckBox, FormField, Select, TextInput } from 'grommet';
import { Add, Next, Previous, Trash } from 'grommet-icons';

const debounce = (func, delay) => {
  let timeout;
  return nextValue => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(nextValue), delay);
  };
};

export default ({ value, onChange }) => {
  const [columns, setColumns] = React.useState(value);
  React.useEffect(() => setColumns(value), [value]);
  const debounceOnChange = React.useCallback(debounce(onChange, 500), []);

  return (
    <Box direction="row" gap="medium">
      {(columns || []).map((c, i) => (
        <Box flex="grow" key={i}>
          <Box flex="grow">
            <FormField label="property">
              <TextInput
                value={c.property || ''}
                onChange={event => {
                  const nextValue = JSON.parse(JSON.stringify(columns));
                  nextValue[i].property = event.target.value;
                  setColumns(nextValue);
                  debounceOnChange(nextValue);
                }}
              />
            </FormField>
            <FormField label="header">
              <TextInput
                value={c.header || ''}
                onChange={event => {
                  const nextValue = JSON.parse(JSON.stringify(value));
                  nextValue[i].header = event.target.value;
                  setColumns(nextValue);
                  debounceOnChange(nextValue);
                }}
              />
            </FormField>
            <FormField label="align">
              <Select
                options={['start', 'center', 'end', 'undefined']}
                value={c.align || ''}
                onChange={({ option }) => {
                  const nextValue = JSON.parse(JSON.stringify(value));
                  nextValue[i].align =
                    option === 'undefined' ? undefined : option;
                  onChange(nextValue);
                }}
              />
            </FormField>
            <FormField label="verticalAlign">
              <Select
                options={['top', 'middle', 'bottom', 'undefined']}
                value={c.verticalAlign || ''}
                onChange={({ option }) => {
                  const nextValue = JSON.parse(JSON.stringify(value));
                  nextValue[i].verticalAlign =
                    option === 'undefined' ? undefined : option;
                  onChange(nextValue);
                }}
              />
            </FormField>
            {['primary', 'search', 'sortable'].map(subProp => (
              <FormField key={subProp}>
                <Box pad="small">
                  <CheckBox
                    label={subProp}
                    checked={c[subProp] || false}
                    onChange={event => {
                      const nextValue = JSON.parse(JSON.stringify(value));
                      nextValue[i][subProp] = event.target.checked;
                      onChange(nextValue);
                    }}
                  />
                </Box>
              </FormField>
            ))}
            <FormField label="aggregate">
              <Select
                options={['avg', 'max', 'min', 'sum', 'undefined']}
                value={c.aggregate || ''}
                onChange={({ option }) => {
                  const nextValue = JSON.parse(JSON.stringify(value));
                  nextValue[i].aggregate =
                    option === 'undefined' ? undefined : option;
                  onChange(nextValue);
                }}
              />
            </FormField>
            {c.aggregate && (
              <FormField>
                <Box pad="small">
                  <CheckBox
                    label="footer aggregate"
                    checked={!!c.footer || false}
                    onChange={event => {
                      const nextValue = JSON.parse(JSON.stringify(value));
                      nextValue[i].footer = event.target.checked
                        ? { aggregate: true }
                        : undefined;
                      onChange(nextValue);
                    }}
                  />
                </Box>
              </FormField>
            )}
          </Box>
          <Box direction="row" align="center" justify="between">
            <Button
              icon={<Trash />}
              hoverIndicator
              onClick={() => {
                const nextValue = JSON.parse(JSON.stringify(value));
                nextValue.splice(i, 1);
                onChange(nextValue.filter(c => c));
              }}
            />
            <Box direction="row">
              <Button
                icon={<Previous />}
                hoverIndicator
                disabled={i === 0}
                onClick={() => {
                  const nextValue = JSON.parse(JSON.stringify(value));
                  const tmpColumn = nextValue[i];
                  nextValue[i] = nextValue[i - 1];
                  nextValue[i - 1] = tmpColumn;
                  onChange(nextValue);
                }}
              />
              <Button
                icon={<Next />}
                hoverIndicator
                disabled={i === value.length - 1}
                onClick={() => {
                  const nextValue = JSON.parse(JSON.stringify(value));
                  const tmpColumn = nextValue[i];
                  nextValue[i] = nextValue[i + 1];
                  nextValue[i + 1] = tmpColumn;
                  onChange(nextValue);
                }}
              />
            </Box>
          </Box>
        </Box>
      ))}
      <Button
        icon={<Add />}
        hoverIndicator
        onClick={() => {
          const nextValue = JSON.parse(JSON.stringify(value));
          nextValue.push({});
          onChange(nextValue);
        }}
      />
    </Box>
  );
};
