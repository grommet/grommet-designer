import React from 'react';
import { Text } from 'grommet';
import InlineOption from './InlineOption';

const short = {
  xxsmall: 'xxS',
  xsmall: 'xS',
  small: 'S',
  medium: 'M',
  large: 'L',
  xlarge: 'xL',
  xxlarge: 'xxL',
};

const SizeState = ({ checked, hover, size }) => {
  return (
    <InlineOption checked={checked} hover={hover} label={size}>
      <Text
        size={size}
        weight={checked ? 'bold' : undefined}
        color={checked ? 'white' : 'dark-4'}
      >
        {short[size] || 'x'}
      </Text>
    </InlineOption>
  );
};

export default SizeState;
