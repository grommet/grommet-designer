import React, { useState } from 'react';
import { Box, Button, Footer, FormField, List, Text, TextInput } from 'grommet';
import { Add, Trash } from 'grommet-icons';
import BackButton from './BackButton';
import ReorderIcon from './ReorderIcon';
import useDebounce from './useDebounce';

const SelectOptions = ({ value: valueProp = [], onChange: onChangeProp }) => {
  const [value, onChange] = useDebounce(valueProp, onChangeProp);
  const [reorder, setReorder] = useState();

  if (reorder)
    return (
      <Box pad={{ bottom: 'small' }} gap="small">
        <List data={value} pad="none" onOrder={onChange}>
          {(option) => (
            <Box>
              <Text>{option}</Text>
            </Box>
          )}
        </List>
        <Footer>
          <BackButton
            title="back to options"
            onClick={() => setReorder(false)}
          />
        </Footer>
      </Box>
    );

  return (
    <Box gap="medium">
      <List
        // convert to objects so key doesn't change when editing
        data={value.map((option, id) => ({ id, option }))}
        primaryKey="id"
        border={false}
        pad="none"
      >
        {(item, i) => (
          <Box key={i} direction="row" align="center" justify="end" flex="grow">
            <FormField>
              <TextInput
                value={item.option || ''}
                onChange={(event) => {
                  const nextValue = JSON.parse(JSON.stringify(value));
                  nextValue[i] = event.target.value;
                  onChange(nextValue);
                }}
              />
            </FormField>
            <Button
              icon={<Trash />}
              hoverIndicator
              onClick={() => {
                const nextValue = JSON.parse(JSON.stringify(value));
                nextValue.splice(i, 1);
                onChange(nextValue);
              }}
            />
          </Box>
        )}
      </List>
      <Footer>
        <Button
          icon={<Add />}
          tip={{
            content: 'Add option',
            dropProps: { align: { left: 'right' } },
          }}
          hoverIndicator
          onClick={() => {
            const nextValue = JSON.parse(JSON.stringify(value));
            // start with a reasonable value, we do this so components like
            // CheckBoxGroup don't have duplicate key issues
            let suffix = 1;
            while (nextValue.includes(`option ${suffix}`)) suffix += 1;
            nextValue.push(`option ${suffix}`);
            onChange(nextValue);
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

export default SelectOptions;
