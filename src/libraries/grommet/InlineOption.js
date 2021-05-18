import React from 'react';
import { Box, Tip } from 'grommet';

const InlineOption = ({ border, checked, children, hover, label, pad }) => {
  return (
    <Tip content={label}>
      <Box
        border={border}
        pad={pad || 'xsmall'}
        background={hover && !checked ? { color: 'active' } : undefined}
      >
        {children}
      </Box>
    </Tip>
  );
};

export default InlineOption;
