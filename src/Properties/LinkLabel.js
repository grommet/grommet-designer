import React from 'react';
import { Box, Text } from 'grommet';
import { getName } from '../design2';

const LinkLabel = ({ selected, value }) => {
  let label;
  if (!value || value.length === 0) {
    label = '';
  } else if (value.component) {
    label = getName(value.component);
  } else if (value.screen) {
    label = getName(value.screen);
  } else if (value.label) {
    label = value.label;
  } else if (Array.isArray(value)) {
    label = value.map((v) => v.label).join(', ');
  } else if (typeof value === 'string') {
    // defensive
    label = value;
  } else {
    label = JSON.stringify(value);
  }
  return (
    <Box pad="small">
      <Text weight={selected ? 'bold' : undefined}>{label}&nbsp;</Text>
    </Box>
  );
};

export default LinkLabel;
