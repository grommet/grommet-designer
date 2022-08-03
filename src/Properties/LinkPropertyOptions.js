import React, { useContext, useMemo, useState } from 'react';
import { Grid, Select, Text } from 'grommet';
import { getLinkOptions } from '../design2';
import SelectionContext from '../SelectionContext';
import LinkLabel from './LinkLabel';

const optionValue = (options) => (option) => {
  let result;
  options.some((o) => {
    if (o === option) result = o;
    else if (o.control && o.control === option.control) result = o;
    else if (
      o.screen &&
      o.component &&
      o.screen === option.screen &&
      o.component === option.component
    )
      result = o;
    else if (
      !o.component &&
      !option.component &&
      o.screen &&
      o.screen === option.screen
    )
      result = o;
    return result;
  });
  return result;
};

const LinkPropertySelect = ({ linkOptions, onChange, value }) => {
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
      valueLabel={<LinkLabel selected value={value} />}
      valueKey={optionValue(linkOptions)}
    >
      {(option, index, options, { selected }) => (
        <LinkLabel selected={selected} value={option} />
      )}
    </Select>
  );
};

const LinkPropertyOptions = ({
  options, // [string | { label: string, value: string }, ...]
  value,
  onChange,
}) => {
  const [selection] = useContext(SelectionContext);
  const linkOptions = useMemo(() => getLinkOptions(selection), [selection]);
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
