import React, { Fragment } from 'react';
import {
  Box,
  Button,
  FormField,
  MaskedInput,
  Paragraph,
  Select,
  RadioButtonGroup,
} from 'grommet';
import { Add, Trash } from 'grommet-icons';

const flavors = ['all the same size', 'different sizes'];
const sizeOptions = [
  'xxsmall',
  'xsmall',
  'small',
  'medium',
  'large',
  'xlarge',
  'xxlarge',
];
const fractionalOptions = ['1/2', '1/3', '2/3', '1/4', '3/4', 'full'];
const contentOptions = ['flex', 'auto'];

const GridColumns = ({ value, onChange }) => {
  return (
    <Box>
      <Paragraph>
        For an adaptive grid with identical columns, set a single column size
        and all children will have the same size.
      </Paragraph>
      <Box pad="small">
        <RadioButtonGroup
          name="flavor"
          options={flavors}
          value={Array.isArray(value) ? flavors[1] : flavors[0]}
          onChange={(event) => {
            const choice = event.target.value;
            let nextValue;
            if (choice === flavors[1]) {
              nextValue = value ? [value] : [''];
            } else if (value[0]) {
              nextValue = value[0].size || value[0];
            } else {
              nextValue = undefined;
            }
            onChange(nextValue);
          }}
        />
      </Box>
      {Array.isArray(value) ? (
        <Box direction="row" gap="medium">
          {value.map((c, i) => (
            <Box key={i}>
              <Box flex="grow">
                <FormField label="size">
                  <Select
                    options={[
                      ...sizeOptions,
                      ...fractionalOptions,
                      ...contentOptions,
                      'min/max',
                    ]}
                    value={
                      (c || {}).size ||
                      (Array.isArray(c) && 'min/max') ||
                      c ||
                      ''
                    }
                    onChange={({ option }) => {
                      const nextValue = JSON.parse(JSON.stringify(value));
                      if (option === 'min/max') {
                        nextValue[i] = [
                          typeof nextValue[i] === 'string' ? nextValue[i] : '',
                        ];
                      } else {
                        if (nextValue[i].size) {
                          nextValue[i].size = option;
                        } else {
                          nextValue[i] = option;
                        }
                      }
                      onChange(nextValue);
                    }}
                  />
                </FormField>
                {Array.isArray(c) && (
                  <Fragment>
                    <FormField label="min">
                      <Select
                        options={[
                          ...sizeOptions,
                          ...fractionalOptions,
                          ...contentOptions,
                        ]}
                        value={c[0] || ''}
                        onChange={({ option }) => {
                          const nextValue = JSON.parse(JSON.stringify(value));
                          nextValue[i][0] = option;
                          onChange(nextValue);
                        }}
                      />
                    </FormField>
                    <FormField label="max">
                      <Select
                        options={[
                          ...sizeOptions,
                          ...fractionalOptions,
                          ...contentOptions,
                        ]}
                        value={c[1] || ''}
                        onChange={({ option }) => {
                          const nextValue = JSON.parse(JSON.stringify(value));
                          nextValue[i][1] = option;
                          onChange(nextValue);
                        }}
                      />
                    </FormField>
                  </Fragment>
                )}
              </Box>
              {value.length > 1 && (
                <Button
                  icon={<Trash />}
                  hoverIndicator
                  onClick={() => {
                    const nextValue = JSON.parse(JSON.stringify(value));
                    nextValue.splice(i, 1);
                    onChange(nextValue);
                  }}
                />
              )}
            </Box>
          ))}
          <Button
            icon={<Add />}
            hoverIndicator
            onClick={() => {
              const nextValue = JSON.parse(JSON.stringify(value));
              nextValue.push('');
              onChange(nextValue);
            }}
          />
        </Box>
      ) : (
        <Box>
          <FormField label="size">
            <Select
              options={[...sizeOptions, ...contentOptions, 'min/max']}
              value={
                (value &&
                  value.size &&
                  Array.isArray(value.size) &&
                  'min/max') ||
                (value && value.size) ||
                value ||
                ''
              }
              onChange={({ option }) => {
                let nextValue = value
                  ? JSON.parse(JSON.stringify(value))
                  : undefined;
                if (option === 'min/max') {
                  nextValue = {
                    size: [typeof nextValue === 'string' ? nextValue : ''],
                  };
                } else {
                  if (nextValue && nextValue.size) {
                    nextValue.size = option;
                  } else {
                    nextValue = option;
                  }
                }
                onChange(nextValue);
              }}
            />
          </FormField>
          {value && value.size && Array.isArray(value.size) && (
            <Fragment>
              <FormField label="min">
                <Select
                  options={[
                    ...sizeOptions,
                    ...fractionalOptions,
                    ...contentOptions,
                  ]}
                  value={value.size[0] || ''}
                  onChange={({ option }) => {
                    const nextValue = JSON.parse(JSON.stringify(value));
                    nextValue.size[0] = option;
                    onChange(nextValue);
                  }}
                />
              </FormField>
              <FormField label="max">
                <Select
                  options={[
                    ...sizeOptions,
                    ...fractionalOptions,
                    ...contentOptions,
                  ]}
                  value={value.size[1] || ''}
                  onChange={({ option }) => {
                    const nextValue = JSON.parse(JSON.stringify(value));
                    nextValue.size[1] = option;
                    onChange(nextValue);
                  }}
                />
              </FormField>
            </Fragment>
          )}
          <FormField label="count">
            {value && (value === 'flex' || value.size === 'flex') ? (
              <MaskedInput
                mask={[
                  {
                    regexp: /^\d*$/,
                  },
                ]}
                value={value.count}
                onChange={(event) => {
                  const count =
                    event.target.value === ''
                      ? undefined
                      : parseInt(event.target.value, 10);
                  let nextValue =
                    typeof value === 'string'
                      ? { size: value, count }
                      : { ...value, count };
                  onChange(nextValue);
                }}
              />
            ) : (
              <Select
                options={['fit', 'fill', 'undefined']}
                value={(value && value.count) || ''}
                onChange={({ option }) => {
                  let nextValue;
                  if (option === 'undefined') {
                    nextValue =
                      (Array.isArray(value.size) && { size: value.size }) ||
                      value.size ||
                      value;
                  } else {
                    if (typeof value === 'string') {
                      nextValue = { size: value, count: option };
                    } else {
                      nextValue = { ...value, count: option };
                    }
                  }
                  onChange(nextValue);
                }}
              />
            )}
          </FormField>
        </Box>
      )}
    </Box>
  );
};

export default GridColumns;
