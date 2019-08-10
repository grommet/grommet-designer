import React from 'react';
import { Box, Button } from 'grommet';

export default (props) => (
  <Box flex={false}>
    <Button hoverIndicator {...props} />
  </Box>
);
