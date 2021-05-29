import React, { useState } from 'react';
import {
  Box,
  Button,
  Footer,
  FormField,
  List,
  Select,
  Text,
  TextInput,
} from 'grommet';
import { Add, FormNext, Previous, Trash } from 'grommet-icons';
import useDebounce from './useDebounce';
import ReorderIcon from './ReorderIcon';

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

const BackButton = ({ onDone }) => (
  <Button
    icon={<Previous />}
    hoverIndicator
    tip={{
      content: 'Back to items',
      dropProps: { align: { left: 'right' } },
    }}
    onClick={onDone}
  />
);

const MenuItems = ({ linkOptions, value = [], onChange }) => {
  const [active, setActive] = useState();
  const [reorder, setReorder] = useState();

  if (active !== undefined) {
    const item = value[active];
    return (
      <Box>
        <MenuItem
          linkOptions={linkOptions}
          value={item}
          onChange={(nextItem) => {
            const nextValue = JSON.parse(JSON.stringify(value));
            nextValue[active] = nextItem;
            onChange(nextValue);
          }}
        />
        <Footer>
          <BackButton onDone={() => setActive(undefined)} />
          <Button
            icon={<Trash />}
            hoverIndicator
            tip={{
              content: 'Delete item',
              dropProps: { align: { right: 'left' } },
            }}
            onClick={() => {
              const nextValue = JSON.parse(JSON.stringify(value));
              nextValue.splice(active, 1);
              onChange(nextValue.length ? nextValue : undefined);
              setActive(undefined);
            }}
          />
        </Footer>
      </Box>
    );
  }

  if (reorder)
    return (
      <Box pad={{ bottom: 'small' }} gap="small">
        <List data={value} pad="none" onOrder={onChange}>
          {(item) => (
            <Box>
              <Text>{item.label}</Text>
            </Box>
          )}
        </List>
        <Footer>
          <BackButton onDone={() => setReorder(false)} />
        </Footer>
      </Box>
    );

  return (
    <Box gap="small" pad={{ top: 'small' }}>
      <List
        data={value}
        pad="small"
        onClickItem={({ index }) => setActive(index)}
      >
        {(item, i) => (
          <Box
            key={i}
            flex="grow"
            direction="row"
            align="center"
            justify="between"
            gap="medium"
          >
            <Text>{item.label}</Text>
            <FormNext />
          </Box>
        )}
      </List>
      <Footer>
        <Button
          icon={<Add />}
          tip={{
            content: 'Add item',
            dropProps: { align: { left: 'right' } },
          }}
          hoverIndicator
          onClick={() => {
            const nextValue = JSON.parse(JSON.stringify(value || []));
            nextValue.push({});
            onChange(nextValue);
            setActive(nextValue.length - 1);
          }}
        />
        <Button
          icon={<ReorderIcon />}
          tip={{
            content: 'Re-order items',
            dropProps: { align: { right: 'left' } },
          }}
          hoverIndicator
          onClick={() => setReorder(true)}
        />
      </Footer>
    </Box>
  );
};

export default MenuItems;
