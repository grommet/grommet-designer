import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Header,
  Heading,
  Layer,
  List,
  Paragraph,
  Text,
} from 'grommet';
import { Archive, Close } from 'grommet-icons';

const Manage = ({ onClose }) => {
  const [designs, setDesigns] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('designs');
    if (stored) {
      setDesigns(
        JSON.parse(stored)
          .sort((n1, n2) => n1.localeCompare(n2))
          .map((name) => {
            const stored2 = localStorage.getItem(name);
            const design = JSON.parse(stored2);
            design.size = `${Math.floor(stored2.length / 1024)} K`;
            return design;
          }),
      );
    }
  }, []);

  return (
    <Layer margin="medium">
      <Header pad="small">
        <Heading level={2} margin="none">
          My Designs
        </Heading>
        <Button icon={<Close />} hoverIndicator onClick={onClose} />
      </Header>
      <Box flex overflow="auto">
        <Box flex={false} margin="small">
          <Paragraph margin="none">
            Your designs are stored in browser local storage, which has limited
            space. You can offload designs you have published to reclaim local
            storage space.
          </Paragraph>
        </Box>
        <List data={designs} pad="none">
          {(design) => (
            <Box
              direction="row"
              align="center"
              justify="between"
              pad={{ start: 'medium' }}
            >
              <Text weight="bold">{design.name}</Text>
              <Box direction="row" align="center" gap="small">
                <Text>{design.size}</Text>
                {design.publishedUrl && design.modified === false ? (
                  <Button
                    icon={<Archive />}
                    a11yTitle="Offload"
                    hoverIndicator
                    onClick={() => {
                      // replace full design with a minimal one that has just
                      // enough to load it from the published version later
                      const offloadedDesign = {
                        name: design.name,
                        id: design.id,
                        publishedUrl: design.publishedUrl,
                      };
                      localStorage.setItem(
                        offloadedDesign.name,
                        JSON.stringify(offloadedDesign),
                      );
                      design.size = '0';
                      delete design.modified;
                      setDesigns([...designs]); // trigger re-render
                    }}
                  />
                ) : (
                  <Box pad="medium" />
                )}
              </Box>
            </Box>
          )}
        </List>
      </Box>
    </Layer>
  );
};

export default Manage;
