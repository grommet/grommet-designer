import React from 'react';
import { Box, Paragraph, TextArea } from 'grommet';

const prefix = "data:image/svg+xml;utf8,";

const stripPrefix = value => {
  if (value && value.slice(0, prefix.length) === prefix) {
    return value.slice(prefix.length);
  }
  return value || '';
}

export default ({ value, onChange }) => {
  return (
    <Box width="medium">
      <Paragraph margin={{ horizontal: 'small' }}>
        URL or &lt;svg&gt; markup.
      </Paragraph>
      <TextArea
        rows={10}
        value={stripPrefix(value)}
        onChange={(event) => {
          const nextValue = event.target.value;
          if (nextValue[0] === '<') {
            onChange(`${prefix}${nextValue}`);
          } else {
            onChange(nextValue);
          }
        }}
      />
    </Box>
  );
}
