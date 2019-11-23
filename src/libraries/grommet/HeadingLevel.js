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

const HeadingLevel = props => {
  return (
    <InlineOptions name={props.name} options={options} {...props}>
      {(option, { checked, hover }) => {
        return (
          <InlineOption
            checked={checked}
            hover={hover}
            pad={{ vertical: 'xsmall', horizontal: 'small' }}
          >
            <Text
              size={size[option]}
              weight={checked ? 'bold' : undefined}
              color={checked ? 'white' : 'dark-4'}
            >
              {option}
            </Text>
          </InlineOption>
        );
      }}
    </InlineOptions>
  );
};

HeadingLevel.inline = true;

export default HeadingLevel;
