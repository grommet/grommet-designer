import React from 'react';
import { Box, Drop, Text } from 'grommet';

const InlineOption = ({ checked, children, hover, label }) => {
  const ref = React.useRef();
  return (
    <Box
      ref={ref}
      pad="xsmall"
      background={hover && !checked ? 'dark-2' : undefined}
    >
      {children}
      {hover && (
        <Drop target={ref.current} align={{ top: 'bottom' }} plain>
          <Box
            margin="xsmall"
            animation={{ type: 'fadeIn', duration: 100 }}
            background={{ color: 'light-1' }}
            pad="xsmall"
          >
            <Text>{label}</Text>
          </Box>
        </Drop>
      )}
    </Box>
  );
};

export default InlineOption;
