import React from 'react';
import { Box, Button, FormField, Markdown, MaskedInput, TextInput } from 'grommet';
import { Add, Trash } from 'grommet-icons';

const CoordinateInput = ({value, index, name, onChange}) => (
  <MaskedInput
    mask={[
      { regexp: /^[0-9]$/, length: 1, placeholder: 'column' },
      { fixed: ',' },
      { regexp: /^[0-9]$/, length: 1, placeholder: 'row' },
    ]}
    value={value[index][name].map(v => (v === undefined ? '' : v)).join(',')}
    onChange={(event) => {
      const nextValue = JSON.parse(JSON.stringify(value));
      nextValue[index][name] =
        event.target.value.split(',')
          .map(v => (v === '' ? undefined : parseInt(v, 10)));
      onChange(nextValue);
    }}
  />
);

export default ({ value, onChange }) => {
  return (
    <Box>
      <Markdown>
        Make sure you set up **rows** and **columns** as arrays first!
      </Markdown>
      {Array.isArray(value) && (
        <Box direction="row" gap="medium">
          {value.map((area, index) => (
            <Box key={index}>
              <Box flex="grow">
                <FormField label="name">
                  <TextInput
                    value={area.name}
                    onChange={(event) => {
                      const nextValue = JSON.parse(JSON.stringify(value));
                      nextValue[index].name = event.target.value;
                      onChange(nextValue);
                    }}
                  />
                </FormField>
                <FormField label="start">
                  <CoordinateInput
                    value={value}
                    index={index}
                    name="start"
                    onChange={onChange}
                  />
                </FormField>
                <FormField label="end">
                  <CoordinateInput
                    value={value}
                    index={index}
                    name="end"
                    onChange={onChange}
                  />
                </FormField>
              </Box>
              <Button
                icon={<Trash />}
                hoverIndicator
                onClick={() => {
                  const nextValue = JSON.parse(JSON.stringify(value));
                  nextValue.splice(index, 1);
                  onChange(nextValue.length > 0 ? nextValue : undefined);
                }}
              />
            </Box>
          ))}
        </Box>
      )}
      <Button
        icon={<Add />}
        hoverIndicator
        onClick={() => {
          const nextValue = value ? JSON.parse(JSON.stringify(value)) : [];
          nextValue.push({ name: '', start: [], end: [] });
          onChange(nextValue);
        }}
      />
    </Box>
  );
}
