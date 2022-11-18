import React, { useMemo } from 'react';
import { Box, Button, Text } from 'grommet';
import { DocumentMissing, Trash } from 'grommet-icons';
import { removeDesign, useDesigns } from './design2';

const NotFound = ({ id, onDone }) => {
  const designs = useDesigns();

  const indexed = useMemo(
    () => designs.find((d) => d.id === id) && true,
    [designs, id],
  );

  return (
    <Box
      height="100vh"
      pad="large"
      align="center"
      justify="center"
      background="linear-gradient(#66666600, #66666633)"
      animation="fadeIn"
    >
      <Box gap="medium" align="center">
        <Text size="xlarge">bummer, we cannot find it</Text>
        <DocumentMissing size="large" />
        {indexed && (
          <Button
            icon={<Trash />}
            title="remove from index of designs we know about"
            hoverIndicator
            onClick={() => {
              removeDesign(id);
              onDone();
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default NotFound;
