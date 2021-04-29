import React from 'react';
import { Box, Button, FormField, List, Text, TextInput } from 'grommet';
import { Add, Down, Trash, Up } from 'grommet-icons';

const SelectOptions = ({ value = [], onChange }) => {
  return (
    <Box gap="medium">
      <List data={value} border={false} pad="none">
        {(item, i) => (
          <Box key={i} direction="row" align="center" justify="end" flex="grow">
            <Text margin={{ right: 'medium' }} color="text-weak">
              {i + 1}.
            </Text>
            <FormField>
              <TextInput
                value={item || ''}
                onChange={(event) => {
                  const nextValue = JSON.parse(JSON.stringify(value));
                  nextValue[i] = event.target.value;
                  onChange(nextValue);
                }}
              />
            </FormField>
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
      <Button
        icon={<Add />}
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
    </Box>
  );
};

export default SelectOptions;
