import React from 'react';
import { Box, Text } from 'grommet';
import ArrayProperty from './ArrayProperty';
import { getDisplayName } from '../design';

const LinkLabel = design => ({ selected, value }) => {
  let label;
  if (!value) {
    label = '';
  } else if (value.component) {
    label = getDisplayName(design, value.component);
  } else if (value.screen) {
    label = design.screens[value.screen].name;
  } else if (value.label) {
    label = value.label;
  } else {
    label = value;
  }
  return (
    <Box pad="small">
      <Text weight={selected ? 'bold' : undefined}>{label}</Text>
    </Box>
  );
};

const LinkProperty = React.forwardRef(
  ({ design, first, name, onChange, linkOptions, sub, value }, ref) => {
    return (
      <ArrayProperty
        ref={ref}
        name={name}
        sub={sub}
        first={first}
        Label={LinkLabel(design)}
        options={linkOptions}
        value={value}
        valueKey="key"
        onChange={onChange}
      />
    );
  },
);

export default LinkProperty;
