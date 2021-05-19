import React, { Fragment } from 'react';
import { Box, FormField, Select } from 'grommet';

const options = [
  'xxsmall',
  'xsmall',
  'small',
  'medium',
  'large',
  'xlarge',
  'xxlarge',
  '100%',
  'min/max',
  'undefined',
];

const Dimension = ({ name, value, onChange }) => {
  return (
    <Box>
      <Box>
        {typeof value === 'object' ? (
          <Fragment>
            {['min', 'max', 'width'].map((threshold) => (
              <FormField key={threshold} label={threshold}>
                <Select
                  options={options.filter((o) => o !== 'min/max')}
                  value={(value || {})[threshold] || ''}
                  onChange={({ option }) => {
                    let nextValue = JSON.parse(JSON.stringify(value));
                    if (option === 'undefined') {
                      delete nextValue[threshold];
                      if (!nextValue.min && !nextValue.max && !nextValue.width)
                        nextValue = undefined;
                    } else {
                      nextValue[threshold] = option;
                    }
                    onChange(nextValue);
                  }}
                />
              </FormField>
            ))}
          </Fragment>
        ) : (
          <FormField>
            <Select
              options={options}
              value={value || ''}
              onChange={({ option }) => {
                let nextValue = option;
                if (nextValue === 'undefined') nextValue = undefined;
                else if (nextValue === 'min/max') nextValue = {};
                onChange(nextValue);
              }}
            />
          </FormField>
        )}
      </Box>
    </Box>
  );
};

export default Dimension;
