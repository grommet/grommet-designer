import React from 'react';
import { Box, Paragraph, Text } from 'grommet';

const Field = React.forwardRef(({ children, first, label, help, htmlFor, ...rest }, ref) => (
  <Box
    ref={ref}
    direction="row"
    align="center"
    justify="between"
    border={first ? 'horizontal' : 'bottom'}
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
));

export default Field;
