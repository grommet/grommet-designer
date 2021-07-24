import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Header, Heading, Layer, List, Text } from 'grommet';
import { Close } from 'grommet-icons';

const Manage = ({ onClose }) => {
  const [designs, setDesigns] = useState([]);

  useEffect(() => {
    let stored = localStorage.getItem('designs');
    if (stored) {
      setDesigns(JSON.parse(stored));
    }
  }, []);

  const sizes = useMemo(
    () => designs.map((name) => localStorage.getItem(name).length),
    [designs],
  );

  return (
    <Layer margin="medium">
      <Header pad="small">
        <Heading level={2} margin="none">
          My Designs
        </Heading>
        <Button icon={<Close />} hoverIndicator onClick={onClose} />
      </Header>
      <Box flex overflow="auto">
        <List data={designs}>
          {(design, index) => (
            <Box direction="row" align="center" justify="between">
              <Text>{design}</Text>
              <Text>{sizes[index]}</Text>
            </Box>
          )}
        </List>
      </Box>
    </Layer>
  );
};

export default Manage;
