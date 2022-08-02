import React from 'react';
import { Box, Tip } from 'grommet';

const InlineOption = ({ border, children, label, pad }) => {
  return (
    <Tip content={label}>
      <Box border={border} pad={pad || 'xsmall'}>
        {children}
      </Box>
    </Tip>
  );
};

export default InlineOption;
