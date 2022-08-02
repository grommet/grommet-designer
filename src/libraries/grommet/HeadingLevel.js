import React from 'react';
import { Text } from 'grommet';
import InlineOptions from './InlineOptions';
import InlineOption from './InlineOption';

const options = ['1', '2', '3', '4'];

const size = {
  1: 'xlarge',
  2: 'large',
  3: 'medium',
  4: 'small',
};

const HeadingLevel = (props) => {
  return (
    <InlineOptions name={props.name} options={options} {...props}>
      {(option, { checked }) => {
        return (
          <InlineOption
            checked={checked}
            pad={{ vertical: 'xsmall', horizontal: 'small' }}
          >
            <Text
              size={size[option.value]}
              weight={checked ? 'bold' : undefined}
              color={checked ? 'selected-text' : 'border'}
            >
              {option.label}
            </Text>
          </InlineOption>
        );
      }}
    </InlineOptions>
  );
};

HeadingLevel.inline = true;

export default HeadingLevel;
