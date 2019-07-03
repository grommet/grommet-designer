import React from 'react';
import { Box, Paragraph, Text } from 'grommet';

export default ({ children, label, help, htmlFor, ...rest }) => (
  <Box
    direction="row"
    align="center"
    justify="between"
    border="bottom"
    pad={{ right: 'small' }}
    {...rest}
  >
    <Box flex={false} pad={{ vertical: 'small', horizontal: 'medium' }}>
      <Text as="label" htmlFor={htmlFor}>{label}</Text>
      {help && (
        <Box width="small">
          <Paragraph color="dark-4" margin="none">{help}</Paragraph>
        </Box>
      )}
    </Box>
    {children}
  </Box>
);
