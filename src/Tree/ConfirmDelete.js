import React from 'react';
import { Anchor, Box, Button, Footer, Layer, Paragraph, Text } from 'grommet';
import { getDesign, removeDesign } from '../design2';

const ConfirmDelete = ({ onClose, onDone }) => {
  const { date, name, publishedDate, publishedUrl } = getDesign();

  let publishedState;
  if (!publishedUrl) publishedState = 'This design has never been published.';
  else if (date !== publishedDate)
    publishedState = 'The local design has unpublished changes.';
  else
    publishedState = (
      <>
        The <Anchor href={publishedUrl}>published copy</Anchor> of this design
        will still be available.
      </>
    );

  return (
    <Layer
      position="center"
      margin="medium"
      animation="fadeIn"
      onEsc={onClose}
      onClickOutside={onClose}
    >
      <Box flex elevation="medium" pad="large" gap="small">
        <Paragraph margin="none">
          Just checking, are you sure you want to delete
          <br />
          <Text weight="bold"> {name}</Text>?
        </Paragraph>
        <Paragraph margin="none">{publishedState}</Paragraph>
        <Footer justify="start" margin={{ top: 'medium' }}>
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
