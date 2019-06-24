import React from 'react';
import { Box, Button } from 'grommet';

export default (props) => (
  <Box round="full" overflow="hidden">
    <Button hoverIndicator {...props} />
  </Box>
);
