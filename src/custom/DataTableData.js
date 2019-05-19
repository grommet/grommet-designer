import React from 'react';
import { Box, Text, TextArea } from 'grommet';

export default ({ value, onChange }) => {
  const [text, setText] = React.useState(JSON.stringify(value, null, 2));
  const [error, setError] = React.useState(false);
  return (
    <Box width="medium">
      <TextArea
        rows={20}
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          try {
            const t = JSON.parse(event.target.value);
            setError(false);
            onChange(t);
          } catch (e) {
            setError(e.message);
          }
        }}
      />
      {error && <Text color="status-critical">{error}</Text>}
    </Box>
  );
}
