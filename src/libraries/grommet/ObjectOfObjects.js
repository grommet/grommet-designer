import React, { useState, useLayoutEffect, useRef } from 'react';
import { Box, Button, Footer, Header, List, Text, TextInput } from 'grommet';
import { Add, FormNext, Trash } from 'grommet-icons';
import BackButton from './BackButton';

const ObjectOfObjects = ({
  defaultObject = {},
  name,
  value = {},
  messages = { single: 'item', plural: 'items' },
  onChange,
  Edit,
  ...rest
}) => {
  const [active, setActive] = useState(); // key in value
  const [addName, setAddName] = useState();
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
              content: `Delete ${messages.single}`,
              dropProps: { align: { right: 'left' } },
            }}
            onClick={() => {
              const nextValue = JSON.parse(JSON.stringify(value));
              delete nextValue[active];
              onChange(nextValue);
              setActive(undefined);
            }}
          />
        </Footer>
      </Box>
    );
  }

  return (
    <Box gap="small" pad={{ vertical: 'small' }}>
      <List
        data={Object.keys(value)}
        pad="small"
        onClickItem={({ item }) => setActive(item)}
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
            <Text weight="bold">{item}</Text>
            <FormNext />
          </Box>
        )}
      </List>
      <Footer justify="start">
        <TextInput
          placeholder={`add ${messages.single} name`}
          value={addName}
          onChange={(event) => setAddName(event.target.value)}
        />
        <Button
          icon={<Add />}
          tip={{
            content: `Add ${messages.single}`,
            dropProps: { align: { right: 'left' } },
          }}
          hoverIndicator
          onClick={() => {
            const nextValue = JSON.parse(JSON.stringify(value || {}));
            nextValue[addName] = defaultObject;
            onChange(nextValue);
            setActive(addName);
            setAddName('');
          }}
        />
      </Footer>
    </Box>
  );
};

export default ObjectOfObjects;
