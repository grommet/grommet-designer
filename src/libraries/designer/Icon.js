import React from 'react';
import { Box, Text } from 'grommet';
import * as icons from 'grommet-icons';
import metadata from 'grommet-icons/metadata';

const exp = new RegExp(/^[A-Z]/);
export const names = Object.keys(icons).filter(n => exp.test(n));
export const aliases = metadata;

// map size to align with font sizes better, empirically determined,
// maybe work into grommet someday?
const sizes = {
  small: '20px',
  large: '32px',
};

export const SelectLabel = ({ selected, value }) => (
  <Box pad="small" direction="row" gap="small" align="center">
    <Icon icon={value} />
    <Text weight={selected ? 'bold' : undefined}>{value}</Text>
  </Box>
);

const Icon = ({ icon, size, ...rest }) => {
  const Icon = icons[icon] || icons.Blank;
  return <Icon {...rest} size={size ? sizes[size] || size : undefined} />;
};

export default Icon;
