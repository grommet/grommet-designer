import React from 'react';
import { Box, Paragraph, Text } from 'grommet';

const Field = React.forwardRef(
  ({ children, first, label, help, htmlFor, ...rest }, ref) => (
    <Box
      ref={ref}
      direction="row"
      align="center"
      justify="between"
      border={first ? 'horizontal' : 'bottom'}
      pad={{ right: 'small' }}
      {...rest}
    >
      <Box
        as="label"
        flex={false}
        pad={{ vertical: 'small', horizontal: 'medium' }}
        htmlFor={htmlFor}
      >
        <Text>{label}</Text>
        {help && (
          <Box>
            <Paragraph color="dark-4" margin="none">
              {help}
            </Paragraph>
          </Box>
        )}
      </Box>
      {children}
    </Box>
  ),
);

export default Field;
