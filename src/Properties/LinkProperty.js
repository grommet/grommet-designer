import React, { useContext, useMemo } from 'react';
import { Box, Text } from 'grommet';
import { getLinkOptions, getName } from '../design2';
import SelectionContext from '../SelectionContext';
import ArrayProperty from './ArrayProperty';

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
    <Box pad="xsmall">
      <Text weight={selected ? 'bold' : undefined}>{label}</Text>
    </Box>
  );
};

const LinkProperty = React.forwardRef(({ name, onChange, value }, ref) => {
  const [selection] = useContext(SelectionContext);
  const linkOptions = useMemo(() => getLinkOptions(selection), [selection]);
  return (
    <ArrayProperty
      ref={ref}
      name={name}
      Label={LinkLabel}
      options={linkOptions}
      multiple
      value={value}
      labelKey="label"
      valueKey="key"
      onChange={onChange}
    />
  );
});

export default LinkProperty;
