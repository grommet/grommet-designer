import React from 'react';
import { Box, FormField, Select, Text, TextInput } from 'grommet';
import useDebounce from './useDebounce';
import ArrayOfObjects from './ArrayOfObjects';

const optionValue = (options) => (option) => {
  let result;
  const optionString = JSON.stringify(option);
  options.some((o) => {
    if (o === option) result = o;
    else if (JSON.stringify(o) === optionString) result = o;
    return result;
  });
  return result;
};

const MenuItem = ({ linkOptions, value, onChange }) => {
  const [item, setItem] = useDebounce(value, onChange);

  const LinkLabel = ({ selected, value }) => (
    <Box pad="small">
      <Text weight={selected ? 'bold' : undefined}>
        {(value === 'undefined' && 'undefined') || (value && value.label) || ''}
      </Text>
    </Box>
  );

  return (
    <Box flex="grow" align="end">
      <Box flex="grow">
        <FormField label="label">
          <TextInput
            value={item.label || ''}
            onChange={(event) => {
              const nextItem = JSON.parse(JSON.stringify(item));
              nextItem.label = event.target.value;
              setItem(nextItem);
            }}
          />
        </FormField>
        <FormField label="link">
          <Select
            options={linkOptions}
            value={item.link || ''}
            onChange={({ option }) => {
              const nextItem = JSON.parse(JSON.stringify(item));
              nextItem.link = option;
              onChange(nextItem);
            }}
            valueLabel={<LinkLabel selected value={item.link} />}
            valueKey={optionValue(linkOptions)}
          >
            {(option, index, options, { selected }) => (
              <LinkLabel selected={selected} value={option} />
            )}
          </Select>
        </FormField>
      </Box>
    </Box>
  );
};

const MenuItems = (props) => (
  <ArrayOfObjects name="items" labelKey="label" Edit={MenuItem} {...props} />
);

export default MenuItems;
