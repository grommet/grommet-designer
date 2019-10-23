import React from 'react';
import { Box, Button, FormField, Select, Text, TextInput } from 'grommet';
import { Add, Trash } from 'grommet-icons';

export default ({ linkOptions, value, onChange }) => {
  const LinkLabel = ({ active, value }) => (
    <Box pad="small">
      <Text weight={active ? 'bold' : undefined}>
        {(value === 'undefined' && 'undefined') || (value && value.label) || ''}
      </Text>
    </Box>
  );

  return (
    <Box direction="row" gap="medium">
      {(value || []).map((item, i) => (
        <Box flex="grow" key={i}>
          <Box flex="grow">
            <FormField label="label">
              <TextInput
                value={item.label || ''}
                onChange={event => {
                  const nextValue = JSON.parse(JSON.stringify(value));
                  nextValue[i].label = event.target.value;
                  onChange(nextValue);
                }}
              />
            </FormField>
            <FormField label="link">
              <Select
                options={linkOptions}
                value={item.link || ''}
                onChange={({ option }) => {
                  const nextValue = JSON.parse(JSON.stringify(value));
                  nextValue[i].link = option;
                  onChange(nextValue);
                }}
                valueLabel={<LinkLabel active value={item.link} />}
              >
                {option => (
                  <LinkLabel
                    active={option.component === value.component}
                    value={option}
                  />
                )}
              </Select>
            </FormField>
          </Box>
          <Button
            icon={<Trash />}
            onClick={() => {
              const nextValue = JSON.parse(JSON.stringify(value));
              nextValue.splice(i, 1);
              onChange(nextValue.length ? nextValue : undefined);
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
