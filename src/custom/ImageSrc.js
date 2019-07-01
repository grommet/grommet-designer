import React from 'react';
import { Box, Paragraph, TextArea } from 'grommet';

const svgPrefix = "data:image/svg+xml;utf8,";

const stripPrefix = value => {
  if (value && value.slice(0, svgPrefix.length) === svgPrefix) {
    return decodeURIComponent(value.slice(svgPrefix.length));
  }
  return value || '';
}

export default ({ value, onChange }) => {
  return (
    <Box>
      <Paragraph margin="none">
        URL or &lt;svg&gt; markup.
      </Paragraph>
      <TextArea
        rows={4}
        cols={80}
        value={stripPrefix(value)}
        onChange={(event) => {
          const nextValue = event.target.value;
          if (nextValue[0] === '<') {
            onChange(`${svgPrefix}${encodeURIComponent(nextValue)}`);
          } else {
            onChange(nextValue);
          }
        }}
      />
    </Box>
  );
}
