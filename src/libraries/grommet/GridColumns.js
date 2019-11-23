import React, { Fragment } from 'react';
import {
  Box,
  Button,
  FormField,
  Paragraph,
  Select,
  RadioButtonGroup,
} from 'grommet';
import { Add, Trash } from 'grommet-icons';

const flavors = ['all the same size', 'different sizes'];

export default ({ value, onChange }) => {
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
          onChange={event => {
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
                      'xxsmall',
                      'xsmall',
                      'small',
                      'medium',
                      'large',
                      'xlarge',
                      'xxlarge',
                      '1/2',
                      '1/3',
                      '2/3',
                      '1/4',
                      '3/4',
                      'full',
                      'flex',
                      'auto',
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
                          'xxsmall',
                          'xsmall',
                          'small',
                          'medium',
                          'large',
                          'xlarge',
                          'xxlarge',
                          '1/2',
                          '1/3',
                          '2/3',
                          '1/4',
                          '3/4',
                          'full',
                          'flex',
                          'auto',
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
                          'xxsmall',
                          'xsmall',
                          'small',
                          'medium',
                          'large',
                          'xlarge',
                          'xxlarge',
                          '1/2',
                          '1/3',
                          '2/3',
                          '1/4',
                          '3/4',
                          'full',
                          'flex',
                          'auto',
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
              options={[
                'xxsmall',
                'xsmall',
                'small',
                'medium',
                'large',
                'xlarge',
                'xxlarge',
              ]}
              value={(value && value.size) || value || ''}
              onChange={({ option }) => onChange(option)}
            />
          </FormField>
          <FormField label="count">
            <Select
              options={['fit', 'fill', 'undefined']}
              value={(value && value.count) || ''}
              onChange={({ option }) => {
                let nextValue;
                if (option === 'undefined') {
                  nextValue = value.size || value;
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
          </FormField>
        </Box>
      )}
    </Box>
  );
};
