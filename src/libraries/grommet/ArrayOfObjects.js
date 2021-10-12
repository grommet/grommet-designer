import React, { useState, useLayoutEffect, useRef } from 'react';
import { Box, Button, Footer, Header, List, Text } from 'grommet';
import { Add, FormNext, Trash } from 'grommet-icons';
import BackButton from './BackButton';
import ReorderIcon from './ReorderIcon';

const ArrayOfObjects = ({
  defaultObject = {},
  name,
  value = [],
  labelKey,
  onChange,
  Edit,
  ...rest
}) => {
  const [active, setActive] = useState();
  const [reorder, setReorder] = useState();
  const editRef = useRef();
  const [headerBack, setHeaderBack] = useState();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    if (editRef.current) {
      // if the Edit is longer than the window, put a back control up top
      const { top, bottom } = editRef.current.getBoundingClientRect();
      const { innerHeight: height } = window;
      setHeaderBack(top < 0 || bottom > height);
    }
  });

  if (active !== undefined) {
    const item = value[active];
    return (
      <Box ref={editRef}>
        {headerBack && (
          <Header>
            <BackButton
              title={`back to ${name}`}
              onClick={() => setActive(undefined)}
            />
          </Header>
        )}
        <Edit
          value={item}
          onChange={(nextItem, nextDesign) => {
            const nextValue = JSON.parse(JSON.stringify(value));
            nextValue[active] = nextItem;
            onChange(nextValue, nextDesign);
          }}
          {...rest}
        />
        <Footer>
          <BackButton
            title={`back to ${name}`}
            onClick={() => setActive(undefined)}
          />
          <Button
            icon={<Trash />}
            hoverIndicator
            tip={{
              content: 'Delete',
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
              <Text>{item[labelKey]}</Text>
            </Box>
          )}
        </List>
        <Footer>
          <BackButton
            title={`back to ${name}`}
            onClick={() => setReorder(false)}
          />
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
            <Text>{item[labelKey]}</Text>
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
            nextValue.push(defaultObject);
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

export default ArrayOfObjects;
