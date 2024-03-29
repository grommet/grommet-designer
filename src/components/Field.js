import React from 'react';
import { Box, Paragraph, Text } from 'grommet';

const Field = React.forwardRef(
  ({ children, label, help, htmlFor, ...rest }, ref) => (
    <Box
      ref={ref}
      direction="row"
      align="center"
      justify="between"
      border="bottom"
      pad={{ horizontal: 'xsmall' }}
      {...rest}
    >
      <Box
        as="label"
        flex={false}
        pad={{ vertical: 'xsmall', horizontal: 'xsmall' }}
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
