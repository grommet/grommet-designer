import React from 'react';
import { Box, Paragraph, TextArea } from 'grommet';

const dataUrlPrefix = "url('";
const dataUrlSuffix = "')";
const svgPrefix = "data:image/svg+xml;utf8,";

const stripToText = value => {
  if (value && value.slice(0, dataUrlPrefix.length) === dataUrlPrefix) {
    const deDataUrl = value.slice(dataUrlPrefix.length).slice(0, -dataUrlSuffix.length);
    if (deDataUrl.slice(0, svgPrefix.length) === svgPrefix) {
      return deDataUrl.slice(svgPrefix.length);
    } else {
      return deDataUrl;
    }
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
        value={stripToText(value)}
        onChange={(event) => {
          const nextValue = event.target.value;
          if (nextValue[0] === '<') {
            onChange(`${dataUrlPrefix}${svgPrefix}${nextValue}${dataUrlSuffix}`);
          } else {
            onChange(`${dataUrlPrefix}${nextValue}${dataUrlSuffix}`);
          }
        }}
      />
    </Box>
  );
}
