import React from 'react';
import { Box, Button } from 'grommet';

const AddButton = ({ label, onClick }) => (
  <Button hoverIndicator onClick={onClick}>
    <Box pad={{ horizontal: 'small', vertical: 'xsmall' }}>{label}</Box>
  </Button>
);

export default AddButton;
