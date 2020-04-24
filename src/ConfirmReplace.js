import React from 'react';
import { Box, Button, Layer, Paragraph, Text } from 'grommet';

const ConfirmReplace = ({ design, nextDesign, onDone }) => (
  <Layer
    position="top"
    margin="medium"
    modal
    onEsc={() => onDone(undefined)}
    onClickOutside={() => onDone(undefined)}
  >
    <Box pad="large">
      <Paragraph>
        You already have a design named <Text weight="bold">{design.name}</Text>
        . If you make a change, you will replace your local copy. If you do not
        want to replace your copy, you should rename this design.
      </Paragraph>
      <Box direction="row" align="center" gap="medium">
        <Button
          label={`Replace my ${design.name}`}
          onClick={() => {
            nextDesign.derivedFromId = design.id;
            nextDesign.local = true;
            onDone(nextDesign);
          }}
        />
        <Button label="Discard change" onClick={() => onDone(undefined)} />
      </Box>
    </Box>
  </Layer>
);

export default ConfirmReplace;
