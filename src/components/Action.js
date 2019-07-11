import React from 'react';
import { Box, Heading, Layer } from 'grommet';
import { Close } from 'grommet-icons';
import ActionButton from '../components/ActionButton';

const Action = ({ children, label, onClose, ...rest }) => (
  <Layer
    position="top"
    margin="medium"
    plain
    {...rest}
    onEsc={onClose}
    onClickOutside={onClose}
  >
    <Box flex background="dark-1" pad="small" round="small" overflow="hidden" elevation="medium">
      <Box flex={false} direction="row" align="start" justify="between">
        <ActionButton
          title='close'
          icon={<Close />}
          hoverIndicator
          onClick={onClose}
        />
        {label && (
          <Heading
            level={2}
            size="small"
            margin={{ vertical: 'none', horizontal: 'small' }}
          >
            {label}
          </Heading>
        )}
      </Box>
      <Box flex pad="medium" align="start" overflow="auto">
        {children}
      </Box>
    </Box>
  </Layer>
);

export default Action;
