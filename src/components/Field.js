import React from 'react';
import { Box, Text } from 'grommet';

export default ({ children, label, ...rest }) => (
  <Box
    direction="row"
    align="center"
    justify="between"
    border="bottom"
    {...rest}
  >
    <Box flex={false} pad={{ vertical: 'small', horizontal: 'medium' }}>
      <Text>{label}</Text>
    </Box>
    {children}
  </Box>
);
