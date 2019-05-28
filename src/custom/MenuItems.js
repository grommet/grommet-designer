import React from 'react';
import { Box, Button, FormField, Select, TextInput } from 'grommet';
import { Add, Trash } from 'grommet-icons';
import { getDisplayName, getLinkOptions } from '../designs';

export default ({ design, selected, value, onChange }) => {
  const linkOptions = getLinkOptions(design, selected);
  return (
    <Box direction="row" gap="medium">
      {(value || []).map((item, i) => (
        <Box flex="grow" key={i}>
          <Box flex="grow">
            <FormField label="label">
              <TextInput
                value={item.label || ''}
                onChange={(event) => {
                  const nextValue = JSON.parse(JSON.stringify(value));
                  nextValue[i].label = event.target.value;
                  onChange(nextValue);
                }}
              />
            </FormField>
            <FormField label="link to">
              <Select
                options={linkOptions}
                value={item.linkTo || ''}
                onChange={({ option }) => {
                  const nextValue = JSON.parse(JSON.stringify(value));
                  nextValue[i].linkTo = option;
                  onChange(nextValue);
                }}
                valueLabel={item.linkTo ? (
                  <Box pad="small">
                    {getDisplayName(design, item.linkTo)}
                  </Box>
                ) : undefined}
              >
                {(option) => (
                  <Box pad="small">
                    {option ? getDisplayName(design, option) : 'clear'}
                  </Box>
                )}
              </Select>
            </FormField>
          </Box>
          <Button
            icon={<Trash />}
            onClick={() => {
              const nextValue = JSON.parse(JSON.stringify(value));
              delete nextValue[i];
              onChange(nextValue);
            }}
          />
        </Box>
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
}
