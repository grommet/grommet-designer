import React, { useEffect, useState } from 'react';
import { Box, Markdown } from 'grommet';
import Action from '../components/Action';
import readmePath from '../README.md';

const Help = ({ onClose }) => {
  const [readme, setReadme] = useState();

  useEffect(() => {
    fetch(readmePath)
      .then((response) => {
        if (response.ok) {
          response
            .text()
            .then((text) => setReadme(text.split('\n').splice(8).join('\n')));
        }
      })
      .catch();
  }, []);

  return (
    <Action label="help" onClose={onClose}>
      <Box flex={false}>
        {readme && (
          <Box flex={false}>
            <Markdown>{readme}</Markdown>
          </Box>
        )}
      </Box>
    </Action>
  );
};

export default Help;
