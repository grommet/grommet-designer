import React from 'react';
import { Box, Button, FormField, Select, Text, TextInput } from 'grommet';
import { Add, Trash } from 'grommet-icons';
import useDebounce from './useDebounce';

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

const MenuItem = ({ linkOptions, value, onChange, onDelete }) => {
  const [item, setItem] = useDebounce(value, onChange);

  const LinkLabel = ({ selected, value }) => (
    <Box pad="small">
      <Text weight={selected ? 'bold' : undefined}>
        {(value === 'undefined' && 'undefined') || (value && value.label) || ''}
      </Text>
    </Box>
  );

  return (
    <Box flex="grow">
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
      <Button icon={<Trash />} onClick={onDelete} />
    </Box>
  );
};

const MenuItems = ({ linkOptions, value, onChange }) => (
  <Box direction="row" gap="medium">
    {(value || []).map((item, i) => (
      <MenuItem
        key={i}
        linkOptions={linkOptions}
        value={item}
        onChange={(nextItem) => {
          const nextValue = JSON.parse(JSON.stringify(value));
          nextValue[i] = nextItem;
          onChange(nextValue);
        }}
        onDelete={() => {
          const nextValue = JSON.parse(JSON.stringify(value));
          nextValue.splice(i, 1);
          onChange(nextValue.length ? nextValue : undefined);
        }}
      />
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

export default MenuItems;
