import React from 'react';
import { Box, Paragraph, TextArea } from 'grommet';

export default ({ value, onChange }) => {
  return (
    <Box>
      <Paragraph margin="none">One per line</Paragraph>
      <TextArea
        rows={4}
        cols={20}
        value={value ? value.join('\n') : ''}
        onChange={event => {
          const nextValue = event.target.value;
          onChange(nextValue ? nextValue.split('\n') : '');
        }}
      />
    </Box>
  );
};
