import React from 'react';
import { Box, Select, Text } from 'grommet';

const OptionLabel = ({ selected, value }) => (
  <Box pad="small">
    <Text weight={selected ? 'bold' : undefined}>
      {(typeof value !== 'string' ? JSON.stringify(value) : value) || ''}
    </Text>
  </Box>
);

const PrimaryKey = ({ dropTarget, onChange, value }) => {
  return (
    <Select
      plain
      dropTarget={dropTarget}
      id="primary"
      name="primary"
      options={['false', 'undefined']}
      value={typeof value === 'boolean' ? value.toString() : value || ''}
      valueLabel={<OptionLabel value={value} selected />}
      onChange={({ option }) => {
        onChange(option === 'undefined' ? undefined : option);
      }}
    >
      {(option, index, options, { selected }) => (
        <OptionLabel value={option} selected={selected} />
      )}
    </Select>
  );
};

PrimaryKey.inline = true;

export default PrimaryKey;
