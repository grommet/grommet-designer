import React from 'react';
import { Box, Button, FormField, Select, TextInput } from 'grommet';
import { Add, Trash } from 'grommet-icons';

const set = (value, index, property, propertyValue) => {
  let nextValue;
  if (Array.isArray(value)) {
    nextValue = JSON.parse(JSON.stringify(value));
    if (propertyValue !== undefined) {
      nextValue[index][property] = propertyValue;
    } else {
      delete nextValue[index][property];
    }
  } else if (typeof value === 'object') {
    nextValue = JSON.parse(JSON.stringify(value));
    if (propertyValue !== undefined) {
      nextValue[property] = propertyValue;
    } else {
      delete nextValue[property];
      if (Object.keys(nextValue).length === 1) {
        nextValue = nextValue.type;
      }
    }
  } else {
    if (property !== 'type') {
      nextValue = { type: value, [property]: propertyValue };
    } else {
      nextValue = propertyValue;
    }
  }
  return nextValue;
};

export default ({ value, onChange }) => (
  <Box direction="row" gap="medium">
    {(
      (value && Array.isArray(value) && value) ||
      (value && typeof value === 'object' && [value]) ||
      (value && [{ type: value }]) || [{}]
    ).map((c, i) => (
      <Box flex="grow" key={i}>
        <Box flex="grow">
          <FormField label="type">
            <Select
              options={[
                'fadeIn',
                'fadeOut',
                'slideUp',
                'slideDown',
                'slideLeft',
                'slideRight',
                'zoomIn',
                'zoomOut',
                'jiggle',
                'pulse',
              ]}
              value={c.type || ''}
              onChange={({ option }) => {
                const nextValue = set(value, i, 'type', option);
                onChange(nextValue);
              }}
            />
          </FormField>
          <FormField label="delay">
            <TextInput
              value={c.delay || ''}
              onChange={event => {
                const nextValue = set(
                  value,
                  i,
                  'delay',
                  parseInt(event.target.value, 10) || undefined,
                );
                onChange(nextValue);
              }}
            />
          </FormField>
          <FormField label="duration">
            <TextInput
              value={c.duration || ''}
              onChange={event => {
                const nextValue = set(
                  value,
                  i,
                  'duration',
                  parseInt(event.target.value, 10) || undefined,
                );
                onChange(nextValue);
              }}
            />
          </FormField>
          <FormField label="size">
            <Select
              options={[
                'xsmall',
                'small',
                'medium',
                'large',
                'xlarge',
                'undefined',
              ]}
              value={c.size || ''}
              onChange={({ option }) => {
                const nextValue = set(
                  value,
                  i,
                  'size',
                  option === 'undefined' ? undefined : option,
                );
                onChange(nextValue);
              }}
            />
          </FormField>
        </Box>
        <Button
          icon={<Trash />}
          onClick={() => {
            let nextValue = JSON.parse(JSON.stringify(value));
            if (Array.isArray(nextValue)) {
              nextValue.splice(i, 1);
              if (nextValue.length === 1) {
                nextValue = nextValue[0];
              }
            } else {
              nextValue = undefined;
            }
            onChange(nextValue);
          }}
        />
      </Box>
    ))}
    <Button
      icon={<Add />}
      hoverIndicator
      onClick={() => {
        let nextValue = JSON.parse(JSON.stringify(value));
        if (Array.isArray(nextValue)) {
          nextValue.push({});
        } else {
          if (typeof nextValue === 'string') nextValue = { type: nextValue };
          nextValue = [nextValue, {}];
        }
        onChange(nextValue);
      }}
    />
  </Box>
);
