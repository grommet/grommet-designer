import React from 'react';
import { Box, Drop, Text } from 'grommet';

const InlineOption = ({ border, checked, children, hover, label, pad }) => {
  const ref = React.useRef();
  return (
    <Box
      ref={ref}
      border={border}
      pad={pad || 'xsmall'}
      background={hover && !checked ? { color: 'active' } : undefined}
    >
      {children}
      {hover && label && (
        <Drop target={ref.current} align={{ top: 'bottom' }}>
          <Box
            margin="xsmall"
            animation={{ type: 'fadeIn', duration: 100 }}
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
