import React from 'react';
import { Box, TextArea } from 'grommet';

export default ({ value, onChange }) => {
  return (
    <Box>
      <TextArea
        rows={4}
        cols={80}
        value={value}
        onChange={(event) => {
          const nextValue = event.target.value;
          onChange(nextValue);
        }}
      />
    </Box>
  );
}
