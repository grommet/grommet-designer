import React from 'react';
import { Box, Paragraph, Text } from 'grommet';

const Field = React.forwardRef(
  ({ children, first, label, help, htmlFor, sub, ...rest }, ref) => (
    <Box
      ref={ref}
      direction="row"
      align="center"
      justify="between"
      border={first ? 'horizontal' : 'bottom'}
      pad={{ left: sub ? 'none' : 'small', right: 'small' }}
      {...rest}
    >
      <Box
        as="label"
        flex={false}
        pad={{ vertical: 'small', horizontal: 'small' }}
        htmlFor={htmlFor}
      >
        <Text>{label}</Text>
        {help && (
          <Box>
            <Paragraph color="text-xweak" margin="none">
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
