import React from 'react';
import { Box, Button, Layer } from 'grommet';
import { Close } from 'grommet-icons';

const Action = ({ children, onClose }) => (
  <Layer position="top-left" onEsc={onClose} onClickOutside={onClose}>
    <Box flex background="dark-1">
      <Box flex={false}>
        <Button icon={<Close />} hoverIndicator onClick={onClose} />
      </Box>
      <Box flex pad="large" align="start" overflow="auto">
        {children}
      </Box>
    </Box>
  </Layer>
);

export default Action;
