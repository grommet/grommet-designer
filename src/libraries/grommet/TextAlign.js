import React from 'react';
import { Box, Text } from 'grommet';
import InlineOptions from './InlineOptions';
import InlineOption from './InlineOption';

const options = ['start', 'center', 'end'];

const TextAlign = (props) => {
  return (
    <InlineOptions name={props.name} options={options} {...props}>
      {(option, { checked }) => {
        const pad = {};
        const { label, value } = option;
        if (value === 'start') pad.right = 'small';
        else if (value === 'center') pad.horizontal = 'xsmall';
        else if (value === 'end') pad.left = 'small';
        return (
          <InlineOption checked={checked} label={label}>
            <Box pad={pad} border="vertical">
              <Text
                weight={checked ? 'bold' : undefined}
                color={checked ? 'selected-background' : 'border'}
              >
                a
              </Text>
            </Box>
          </InlineOption>
        );
      }}
    </InlineOptions>
  );
};

TextAlign.inline = true;

export default TextAlign;
