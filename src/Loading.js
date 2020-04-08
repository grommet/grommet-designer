import React from 'react';
import { Box, Text } from 'grommet';

const Loading = () => (
  <Box fill pad="large" align="center" justify="center">
    <Box animation="pulse">
      <Text size="xlarge">loading</Text>
    </Box>
  </Box>
);

export default Loading;
