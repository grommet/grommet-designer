import React from 'react';
import { Box, Button, Footer, Layer, Paragraph, Text } from 'grommet';
import { getDesign, removeDesign } from '../design2';

const ConfirmDelete = ({ onClose, onDone }) => {
  const name = getDesign().name;

  return (
    <Layer
      position="center"
      margin="medium"
      animation="fadeIn"
      onEsc={onClose}
      onClickOutside={onClose}
    >
      <Box flex elevation="medium" pad="large" gap="medium">
        <Paragraph>
          Just checking, are you sure you want to delete
          <br />
          <Text weight="bold"> {name}</Text>?
        </Paragraph>
        <Footer justify="start">
          <Button
            label="Yes, delete"
            primary
            onClick={() => {
              localStorage.removeItem(`${name}--state`);
              removeDesign();
              onDone();
            }}
          />
          <Button label="No, cancel" onClick={onClose} />
        </Footer>
      </Box>
    </Layer>
  );
};

export default ConfirmDelete;
