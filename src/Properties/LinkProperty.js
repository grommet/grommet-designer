import React from 'react';
import { Box, Text } from 'grommet';
import ArrayProperty from './ArrayProperty';

const LinkLabel = design => ({ active, value }) => (
  <Box pad="small">
    <Text weight={active ? 'bold' : undefined}>
      {(value === 'undefined' && 'undefined') || (value && value.label) || ''}
    </Text>
  </Box>
);

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
        onChange={onChange}
      />
    );
  },
);

export default LinkProperty;
