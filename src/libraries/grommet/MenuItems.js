import React, { useMemo, useState } from 'react';
import { Box, CheckBox, FormField, Select, Text, TextInput } from 'grommet';
import { getLinkOptions } from '../../design2';
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

const LinkLabel = ({ selected, value }) => {
  let content;
  if (Array.isArray(value)) {
    if (value.length > 1) content = 'multiple';
    else if (value.length === 1) content = value[0].label;
  } else if (value === 'undefined') content = 'undefined';
  else if (value) content = value.label;
  if (!content) content = <>&nbsp;</>;
  return (
    <Box pad="small">
      <Text weight={selected ? 'bold' : undefined}>{content}</Text>
    </Box>
  );
};

const MenuItem = ({ id, value, onChange }) => {
  const linkOptions = useMemo(() => getLinkOptions(id), [id]);
  const [item, setItem] = useDebounce(value, onChange);

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
            multiple
            options={linkOptions}
            value={item.link || []}
            onChange={({ value }) => {
              const nextItem = JSON.parse(JSON.stringify(item));
              nextItem.link = value;
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

const MenuItemGroup = (props) => (
  <ArrayOfObjects
    name="group"
    itemKey="label"
    labelKey="label"
    Edit={MenuItem}
    {...props}
  />
);

const MenuItems = ({ value, ...rest }) => {
  const [groups, setGroups] = useState(
    value?.length ? Array.isArray(value?.[0]) : undefined,
  );

  return (
    <Box>
      <Box pad="small">
        <CheckBox
          label="groups?"
          disabled={value?.length}
          checked={groups}
          onChange={(event) => setGroups(event.target.checked)}
        />
      </Box>
      {groups ? (
        <ArrayOfObjects
          messages={{ single: 'group', plural: 'groups' }}
          defaultObject={[]}
          value={value}
          Edit={MenuItemGroup}
          {...rest}
          name="groups"
        />
      ) : (
        <ArrayOfObjects
          name="items"
          itemKey="label"
          labelKey="label"
          value={value}
          Edit={MenuItem}
          {...rest}
        />
      )}
    </Box>
  );
};

export default MenuItems;
