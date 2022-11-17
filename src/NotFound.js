import React from 'react';
import { Box, Text } from 'grommet';
import { DocumentMissing } from 'grommet-icons';

const NotFound = () => (
  <Box
    height="100vh"
    pad="large"
    align="center"
    justify="center"
    background="linear-gradient(#66666600, #66666633)"
    animation="fadeIn"
  >
    <Box gap="medium" align="center">
      <Text size="xlarge">bummer, we cannot find it</Text>
      <DocumentMissing size="large" />
    </Box>
  </Box>
);

export default NotFound;
