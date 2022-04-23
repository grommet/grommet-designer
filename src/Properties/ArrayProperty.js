import React from 'react';
import { Box, Select, Text } from 'grommet';
import Field from '../components/Field';

const OptionLabel = ({ selected, value }) => (
  <Box pad="small">
    <Text weight={selected ? 'bold' : undefined}>
      {(typeof value !== 'string' ? JSON.stringify(value) : value) || ''}
    </Text>
  </Box>
);

const ArrayProperty = React.forwardRef(
  (
    {
      children,
      Label,
      multiple,
      name,
      onChange,
      options,
      searchTest,
      value,
      valueKey,
    },
    ref,
  ) => {
    const SelectLabel = React.useMemo(() => Label || OptionLabel, [Label]);
    const [dropTarget, setDropTarget] = React.useState();
    const fieldRef = React.useCallback((node) => setDropTarget(node), []);
    const [searchText, setSearchText] = React.useState('');
    const searchExp = React.useMemo(
      () => searchText && new RegExp(`${searchText}`, 'i'),
      [searchText],
    );
    let selectOptions = options;
    if (searchExp) {
      selectOptions = options.filter(
        (o) =>
          searchExp.test(o.label || o) ||
          (searchTest && searchTest(o, searchExp)),
      );
    }
    if (value !== undefined) {
      selectOptions = [...selectOptions, 'undefined'];
    }

    return (
      <Field key={name} ref={ref || fieldRef} label={name} htmlFor={name}>
        {children}
        <Select
          ref={ref}
          plain
          dropTarget={dropTarget}
          id={name}
          name={name}
          options={selectOptions}
          multiple={multiple}
          value={typeof value === 'boolean' ? value.toString() : value || ''}
          valueLabel={<SelectLabel value={value} selected />}
          valueKey={valueKey}
          onChange={({ option, value: nextValue }) => {
            setSearchText(undefined);
            if (multiple) {
              onChange(option === 'undefined' ? undefined : nextValue);
            } else {
              onChange(option === 'undefined' ? undefined : option);
            }
          }}
          onSearch={
            options.length > 20 || searchExp
              ? (nextSearchText) => setSearchText(nextSearchText)
              : undefined
          }
        >
          {(option, index, options, { selected }) => (
            <SelectLabel value={option} selected={selected} />
          )}
        </Select>
      </Field>
    );
  },
);

export default ArrayProperty;
