import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Select, Text } from 'grommet';
import Field from '../components/Field';
import DataPathField from './DataPathField';

const OptionLabel = ({ selected, value }) => (
  <Box pad="xsmall">
    <Text weight={selected ? 'bold' : undefined}>
      {(typeof value !== 'string' ? JSON.stringify(value) : value) || ''}
    </Text>
  </Box>
);

const ArrayProperty = React.forwardRef(
  (
    {
      children,
      dataPath,
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
    let option;
    if (value !== undefined) {
      if (valueKey?.reduce)
        option = options.find((o) => o[valueKey.key] === value);
      else if (!valueKey) option = value;
    }

    const [focusDataPath, setFocusDataPath] = useState();
    const dpRef = useRef();

    useEffect(() => {
      if (focusDataPath) {
        dpRef.current.focus();
        setFocusDataPath(false);
      }
    }, [focusDataPath]);

    if (dataPath && (value === '' || value?.[0] === '{'))
      return (
        <DataPathField
          ref={dpRef}
          name={name}
          onChange={onChange}
          value={value}
        />
      );

    return (
      <Field key={name} ref={ref || fieldRef} label={name} htmlFor={name}>
        {(dataPath && !value && (
          <Button
            onClick={() => {
              onChange('{}');
              setFocusDataPath(true);
            }}
          >
            <Text color="text-weak">{'{}'}</Text>
          </Button>
        )) ||
          children}
        <Select
          ref={ref}
          plain
          dropTarget={dropTarget}
          id={name}
          name={name}
          options={selectOptions}
          multiple={multiple}
          value={typeof value === 'boolean' ? value.toString() : value || ''}
          valueLabel={<SelectLabel option={option} value={value} selected />}
          valueKey={valueKey}
          onChange={({ option, value: nextValue }) => {
            setSearchText(undefined);
            if (multiple || valueKey?.reduce) {
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
            <SelectLabel option={option} value={option} selected={selected} />
          )}
        </Select>
      </Field>
    );
  },
);

export default ArrayProperty;
