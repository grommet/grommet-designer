import React from 'react';
import { Box, Text } from 'grommet';
import ArrayProperty from './ArrayProperty';
import { getDisplayName } from '../design';

const AlternativeLabel = (design) => ({ selected, value }) => {
  let label;
  if (!value || value.length === 0) {
    label = '';
  } else if (value.component) {
    label = getDisplayName(design, value.component);
  } else if (value.screen) {
    label = (design.screens[value.screen] || {}).name; // defensive
  } else if (value.label) {
    label = value.label;
  } else if (Array.isArray(value)) {
    label = value.map((v) => v.label).join(', ');
  } else {
    label = value;
  }
  return (
    <Box pad="small">
      <Text weight={selected ? 'bold' : undefined}>{label}</Text>
    </Box>
  );
};

const AlternativeProperty = React.forwardRef(
  ({ design, first, name, onChange, alternativeOptions, sub, value }, ref) => {
    return (
      <ArrayProperty
        ref={ref}
        name={name}
        sub={sub}
        first={first}
        Label={AlternativeLabel(design)}
        options={alternativeOptions}
        multiple
        value={value}
        labelKey="label"
        valueKey="key"
        onChange={onChange}
      />
    );
  },
);

export default AlternativeProperty;
