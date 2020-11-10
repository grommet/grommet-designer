import React from 'react';
import { Box, TextArea } from 'grommet';

const TextAreaValue = ({ value, onChange }) => {
  return (
    <Box>
      <TextArea
        rows={20}
        cols={80}
        value={value}
        onChange={(event) => {
          const nextValue = event.target.value;
          onChange(nextValue);
        }}
      />
    </Box>
  );
};

export default TextAreaValue;
