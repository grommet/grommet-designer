import React, { Fragment } from 'react';
import { Box, FormField, Select, RadioButtonGroup } from 'grommet';

const flavors = ['all corners the same', 'varied'];

const sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge', 'full'];

const corners = [
  'top',
  'left',
  'bottom',
  'right',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
];

const BoxRound = ({ name, value, onChange }) => {
  return (
    <Box>
      <Box margin={{ vertical: 'medium' }}>
        <RadioButtonGroup
          name="flavor"
          options={flavors}
          value={typeof value === 'object' ? flavors[1] : flavors[0]}
          onChange={(event) => {
            const choice = event.target.value;
            const nextValue = choice === flavors[1] ? {} : undefined;
            onChange(nextValue);
          }}
        />
      </Box>
      <Box>
        {typeof value === 'object' ? (
          <Fragment>
            <FormField label="corner">
              <Select
                options={value.corner ? [...corners, 'undefined'] : corners}
                value={value.corner || ''}
                onChange={({ option }) =>
                  onChange({
                    ...value,
                    corner: option === 'undefined' ? undefined : option,
                  })
                }
              />
            </FormField>
            <FormField label="size">
              <Select
                options={value.size ? [...sizes, 'undefined'] : sizes}
                value={value.size || ''}
                onChange={({ option }) =>
                  onChange({
                    ...value,
                    size: option === 'undefined' ? undefined : option,
                  })
                }
              />
            </FormField>
          </Fragment>
        ) : (
          <FormField label={name}>
            <Select
              options={value ? [...sizes, 'undefined'] : sizes}
              value={value || ''}
              onChange={({ option }) =>
                onChange(option === 'undefined' ? undefined : option)
              }
            />
          </FormField>
        )}
      </Box>
    </Box>
  );
};

export default BoxRound;
