import React from 'react';
import { Box, Button, CheckBox, FormField, Select, TextInput } from 'grommet';
import { Add, Trash } from 'grommet-icons';

export default ({ value, onChange }) => (
  <Box direction="row" gap="medium">
    {(value || []).map((c, i) => (
      <Box flex="grow" key={i}>
        <Box flex="grow">
          <FormField label="property">
            <TextInput
              value={c.property || ''}
              onChange={(event) => {
                const nextValue = JSON.parse(JSON.stringify(value));
                nextValue[i].property = event.target.value;
                onChange(nextValue);
              }}
            />
          </FormField>
          <FormField label="header">
            <TextInput
              value={c.header || ''}
              onChange={(event) => {
                const nextValue = JSON.parse(JSON.stringify(value));
                nextValue[i].header = event.target.value;
                onChange(nextValue);
              }}
            />
          </FormField>
          <FormField label="align">
            <Select
              options={['start', 'center', 'end', 'undefined']}
              value={c.align || ''}
              onChange={({ option }) => {
                const nextValue = JSON.parse(JSON.stringify(value));
                nextValue[i].align = option === 'undefined' ? undefined : option;
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
                  onChange={(event) => {
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
              options={['avg', 'max', 'min', 'sum']}
              value={c.aggregate || ''}
              onChange={({ option }) => {
                const nextValue = JSON.parse(JSON.stringify(value));
                nextValue[i].aggregate = option;
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
                  onChange={(event) => {
                    const nextValue = JSON.parse(JSON.stringify(value));
                    nextValue[i].footer = event.target.checked ? { aggregate: true } : undefined;
                    onChange(nextValue);
                  }}
                />
              </Box>
            </FormField>
          )}
        </Box>
        <Button
          icon={<Trash />}
          onClick={() => {
            const nextValue = JSON.parse(JSON.stringify(value));
            delete nextValue[i];
            onChange(nextValue);
          }}
        />
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
