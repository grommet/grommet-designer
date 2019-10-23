import React from 'react';
import { Box, Text } from 'grommet';
import * as icons from 'grommet-icons';

const exp = new RegExp(/^[A-Z]/);
export const names = Object.keys(icons).filter(n => exp.test(n));

export const SelectLabel = ({ active, value }) => (
  <Box pad="small" direction="row" gap="small" align="center">
    <Icon icon={value} />
    <Text weight={active ? 'bold' : undefined}>{value}</Text>
  </Box>
);

const Icon = ({ icon, ...rest }) => {
  const Icon = icons[icon || 'Add'] || icons.Blank;
  return <Icon {...rest} />;
};

export default Icon;
