import React from 'react';
import { Box, Text, ThemeContext } from 'grommet';
import ArrayProperty from './ArrayProperty';

const internalColors = ['focus', 'icon', 'placeholder', 'selected'];

const ColorLabel = theme => ({ selected, value }) => (
  <Box pad="small" direction="row" gap="small" align="center">
    <ThemeContext.Extend value={theme}>
      <Box pad="small" background={value} />
    </ThemeContext.Extend>
    <Text weight={selected ? 'bold' : undefined}>{value}</Text>
  </Box>
);

const ColorProperty = React.forwardRef(
  ({ first, name, onChange, sub, theme, value }, ref) => {
    const baseTheme = React.useContext(ThemeContext);
    const options = React.useMemo(() => {
      const merged = { ...baseTheme.global.colors, ...theme.global.colors };
      return Object.keys(merged)
        .filter(c => !internalColors.includes(c))
        .sort();
    }, [baseTheme.global.colors, theme.global.colors]);

    return (
      <ArrayProperty
        ref={ref}
        name={name}
        sub={sub}
        first={first}
        Label={ColorLabel(theme)}
        options={options}
        value={value}
        onChange={onChange}
      />
    );
  },
);

export default ColorProperty;
