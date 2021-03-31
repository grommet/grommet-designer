import React, { useMemo, useState } from 'react';
import { Grid, Select, Text } from 'grommet';
import LinkLabel from './LinkLabel';

const LinkPropertySelect = ({ design, linkOptions, onChange, value }) => {
  const [searchText, setSearchText] = useState('');
  const searchExp = useMemo(
    () => searchText && new RegExp(`${searchText}`, 'i'),
    [searchText],
  );
  let filteredOptions = searchExp
    ? linkOptions.filter((o) => searchExp.test(o.label || o))
    : linkOptions;
  if (value !== undefined) {
    filteredOptions = [...filteredOptions, 'undefined'];
  }

  return (
    <Select
      multiple
      options={filteredOptions}
      value={value || ''}
      onChange={({ option: selectedOption, value: nextValue }) => {
        setSearchText(undefined);
        onChange(selectedOption === 'undefined' ? undefined : nextValue);
      }}
      onSearch={
        linkOptions.length > 20 || searchExp
          ? (nextSearchText) => setSearchText(nextSearchText)
          : undefined
      }
      valueLabel={<LinkLabel design={design} selected value={value} />}
    >
      {(option, index, options, { selected }) => (
        <LinkLabel design={design} selected={selected} value={option} />
      )}
    </Select>
  );
};

const LinkPropertyOptions = ({
  // componentId,
  design,
  linkOptions, // where we can link to, should rename to "linkTargets"?
  options, // [string | { label: string, value: string }, ...]
  value,
  onChange,
}) => {
  return (
    <Grid
      gap="small"
      columns={['1/2', '1/2']}
      align="center"
      margin={{ horizontal: 'medium' }}
    >
      {options.map((option) => {
        const label = option.label || option;
        const name = option.value || option;
        return [
          <Text key="name" textAlign="end">
            {label}
          </Text>,
          <LinkPropertySelect
            key="value"
            design={design}
            linkOptions={linkOptions}
            value={value && value[name]}
            onChange={(nextOptionValue) => {
              let nextValue =
                (value && JSON.parse(JSON.stringify(value))) || {};
              if (nextOptionValue === undefined) {
                delete nextValue[name];
                if (!Object.keys(nextValue)) nextValue = undefined;
              } else nextValue[name] = nextOptionValue;
              onChange(nextValue);
            }}
          />,
        ];
      })}
    </Grid>
  );
};

export default LinkPropertyOptions;
