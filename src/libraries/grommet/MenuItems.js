import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Box,
  Button,
  Footer,
  FormField,
  Header,
  Heading,
  List,
  Select,
  Text,
  TextInput,
} from 'grommet';
import { Add, Blank, Down, FormNext, Previous, Trash, Up } from 'grommet-icons';
import useDebounce from './useDebounce';

const ReorderIcon = () => (
  <Blank>
    <g strokeWidth={2} strokeLinecap="square">
      <path d="M 12,8 L 12,16" />
      <path d="M 4,6 L 12,2 L 20,6" fill="none" stroke={2} />
      <path d="M 4,18 L 12,22 L 20,18" fill="none" stroke={2} />
    </g>
  </Blank>
);

const DraggableBox = styled(Box)`
  cursor: pointer;
  &:hover {
    background: #eee;
  }
`;

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
      <Button
        icon={<Trash />}
        hoverIndicator
        tip={{
          content: 'Delete item',
          dropProps: { align: { right: 'left' } },
        }}
        onClick={onDelete}
      />
    </Box>
  );
};

const BackHeader = ({ onDone, title }) => (
  <Header>
    <Button
      icon={<Previous />}
      hoverIndicator
      tip={{
        content: 'Back to items',
        dropProps: { align: { left: 'right' } },
      }}
      onClick={onDone}
    />
    <Heading level={2} size="small">
      {title}
    </Heading>
  </Header>
);

const ReorderItems = ({ value, onChange, onDone }) => {
  const [dragging, setDragging] = useState();
  return (
    <Box pad={{ bottom: 'small' }}>
      <BackHeader title="Re-order" onDone={onDone} />
      <List data={value} pad="none">
        {(item, i) => (
          <DraggableBox
            key={i}
            flex="grow"
            direction="row"
            align="center"
            pad={{ left: 'small' }}
            gap="medium"
            draggable
            background={dragging === i ? 'active' : undefined}
            onDragStart={(event) => {
              event.dataTransfer.setData('text/plain', ''); // for Firefox
              event.dataTransfer.effectAllowed = 'move';
              setDragging(i);
            }}
            onDragEnd={() => setDragging(undefined)}
            onDragOver={(event) => {
              if (dragging !== undefined && dragging !== i) {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'move';
              }
            }}
            onDrop={(event) => {
              event.preventDefault();
              if (dragging !== i) {
                const nextValue = JSON.parse(JSON.stringify(value));
                const tmp = nextValue[dragging];
                if (dragging < i)
                  for (let index = dragging; index < i; index += 1)
                    nextValue[index] = nextValue[index + 1];
                else
                  for (let index = dragging; index > i; index -= 1)
                    nextValue[index] = nextValue[index - 1];
                nextValue[i] = tmp;
                onChange(nextValue);
              }
            }}
          >
            <Text color="text-weak">{i + 1}.</Text>
            <Box flex="grow">
              <Text>{item.label}</Text>
            </Box>
            <Box direction="row">
              <Button
                icon={<Up />}
                hoverIndicator
                disabled={i === 0}
                onClick={() => {
                  const nextValue = JSON.parse(JSON.stringify(value));
                  const tmp = nextValue[i];
                  nextValue[i] = nextValue[i - 1];
                  nextValue[i - 1] = tmp;
                  onChange(nextValue);
                }}
              />
              <Button
                icon={<Down />}
                hoverIndicator
                disabled={i === value.length - 1}
                onClick={() => {
                  const nextValue = JSON.parse(JSON.stringify(value));
                  const tmp = nextValue[i];
                  nextValue[i] = nextValue[i + 1];
                  nextValue[i + 1] = tmp;
                  onChange(nextValue);
                }}
              />
            </Box>
          </DraggableBox>
        )}
      </List>
    </Box>
  );
};

const MenuItems = ({ linkOptions, value = [], onChange }) => {
  const [active, setActive] = useState();
  const [reorder, setReorder] = useState();

  if (active !== undefined) {
    const item = value[active];
    return (
      <Box>
        <BackHeader title="Edit item" onDone={() => setActive(undefined)} />
        <MenuItem
          linkOptions={linkOptions}
          value={item}
          onChange={(nextItem) => {
            const nextValue = JSON.parse(JSON.stringify(value));
            nextValue[active] = nextItem;
            onChange(nextValue);
          }}
          onDelete={() => {
            const nextValue = JSON.parse(JSON.stringify(value));
            nextValue.splice(active, 1);
            onChange(nextValue.length ? nextValue : undefined);
            setActive(undefined);
          }}
        />
      </Box>
    );
  }

  if (reorder)
    return (
      <ReorderItems
        value={value}
        onChange={onChange}
        onDone={() => setReorder(false)}
      />
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
