import React from 'react';
import { Box, Layer } from 'grommet';
import { Close } from 'grommet-icons';
import ActionButton from '../ActionButton';

const Action = ({ children, onClose }) => (
  <Layer position="top-left" onEsc={onClose} onClickOutside={onClose}>
    <Box flex background="dark-1" pad="small">
      <Box flex={false} align="start">
        <ActionButton icon={<Close />} hoverIndicator onClick={onClose} />
      </Box>
      <Box flex pad="medium" align="start" overflow="auto">
        {children}
      </Box>
    </Box>
  </Layer>
);

export default Action;
