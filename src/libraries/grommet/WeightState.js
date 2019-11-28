import React from 'react';
import { Text } from 'grommet';
import InlineOption from './InlineOption';

const short = {
  bold: 'B',
  normal: 'N',
};

const WeightState = ({ checked, hover, weight }) => {
  return (
    <InlineOption checked={checked} hover={hover} label={weight}>
      <Text weight={weight} color={checked ? 'white' : 'dark-4'}>
        {short[weight] || 'x'}
      </Text>
    </InlineOption>
  );
};

export default WeightState;
