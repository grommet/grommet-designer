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

const SizeState = ({ checked, size }) => {
  return (
    <InlineOption checked={checked} label={size}>
      <Text
        size={size}
        weight={checked ? 'bold' : undefined}
        color={checked ? 'selected-text' : 'border'}
      >
        {short[size] || 'x'}
      </Text>
    </InlineOption>
  );
};

export default SizeState;
