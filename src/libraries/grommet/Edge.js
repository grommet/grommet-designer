import React, { Fragment } from 'react';
import { Box, FormField, Select, RadioButtonGroup } from 'grommet';

const flavors = ['all sides the same', 'varied'];

const Edge = ({ name, value, onChange }) => {
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
            {['horizontal', 'vertical', 'top', 'bottom', 'left', 'right'].map(
              (side) => (
                <FormField key={side} label={side}>
                  <Select
                    options={[
                      'none',
                      'xsmall',
                      'small',
                      'medium',
                      'large',
                      'xlarge',
                      'undefined',
                    ]}
                    value={(value || {})[side] || ''}
                    onChange={({ option }) => {
                      const nextValue = JSON.parse(JSON.stringify(value));
                      if (option === 'undefined') {
                        delete nextValue[side];
                      } else {
                        nextValue[side] = option;
                      }
                      onChange(nextValue);
                    }}
                  />
                </FormField>
              ),
            )}
          </Fragment>
        ) : (
          <FormField label={name}>
            <Select
              options={[
                'none',
                'xsmall',
                'small',
                'medium',
                'large',
                'xlarge',
                'undefined',
              ]}
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

export default Edge;
