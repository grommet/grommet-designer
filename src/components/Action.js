import React from 'react';
import { Box, Button, Heading, Layer } from 'grommet';
import { Close } from 'grommet-icons';

const Action = ({ children, label, onClose, ...rest }) => (
  <Layer
    position="top"
    margin="medium"
    modal
    {...rest}
    onEsc={onClose}
    onClickOutside={onClose}
  >
    <Box flex elevation="medium">
      <Box flex={false} direction="row" align="center" justify="between">
        <Button
          title="close"
          tip="close"
          icon={<Close />}
          hoverIndicator
          onClick={onClose}
        />
        {label && (
          <Heading
            level={2}
            size="small"
            margin={{ vertical: 'none', horizontal: 'large' }}
          >
            {label}
          </Heading>
        )}
      </Box>
      <Box flex pad={{ horizontal: 'large', bottom: 'large' }} overflow="auto">
        <Box flex={false}>{children}</Box>
      </Box>
    </Box>
  </Layer>
);

export default Action;
