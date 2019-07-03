import React from 'react';
import { Box, Paragraph, Stack, Text } from 'grommet';
import { getInitialSelected } from '../design';
import Action from '../components/Action';

const Import = ({ onClose, onChange }) => {
  const [error, setError] = React.useState();
  return (
    <Action onClose={onClose}>
      <Box width="medium" height="small">
        <Stack fill guidingChild="last" interactiveChild="first">
          <input
            style={{ display: 'block', width: '100%', height: '100%' }}
            type="file"
            onChange={(event) => {
              setError(undefined);
              const reader = new FileReader();
              reader.onload = () => {
                try {
                  const design = JSON.parse(reader.result);
                  const selected = getInitialSelected(design);
                  onChange({ design, selected });
                  onClose();
                } catch (e) {
                  setError(e.message);
                }
              };
              reader.readAsText(event.target.files[0]);
            }}
          />
          <Box
              fill
              background="dark-1"
              border={{ side: 'all', color: 'dark-3', size: 'medium' }}
              align="center"
              justify="center"
            >
              <Paragraph>Click to browse files or drop a file here.</Paragraph>
              {error && (
                <Box background="status-critical" pad="medium">
                  <Text>{error}</Text>
                </Box>
              )}
            </Box>
        </Stack>
      </Box>
    </Action>
  );
};

export default Import;
