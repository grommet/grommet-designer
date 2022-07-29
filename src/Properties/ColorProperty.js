import React, {
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Box, Button, Text, ThemeContext } from 'grommet';
import { deepMerge } from 'grommet/utils';
import { getTheme } from '../design2';
import ArrayProperty from './ArrayProperty';
import DataPathField from './DataPathField';

// input is due to a bug in grommet-theme-hpe v1.0.5
const internalColors = [
  'focus',
  'icon',
  'placeholder',
  'selected',
  'selected-background',
  'selected-text',
  'input',
];

const ColorLabel =
  (theme) =>
  ({ selected, value }) =>
    (
      <Box pad="xsmall" direction="row" gap="small" align="center">
        <ThemeContext.Extend value={theme}>
          <Box pad="small" background={value} />
        </ThemeContext.Extend>
        <Text weight={selected ? 'bold' : undefined}>{value}</Text>
      </Box>
    );

const ColorProperty = forwardRef(
  ({ first, name, onChange, sub, value }, ref) => {
    const theme = getTheme();
    const baseTheme = useContext(ThemeContext);
    const options = useMemo(() => {
      const merged = deepMerge(baseTheme.global.colors, theme.global.colors);
      return Object.keys(merged)
        .filter((c) => merged[c] && !internalColors.includes(c))
        .sort();
    }, [baseTheme.global.colors, theme.global.colors]);

    const [focusDataPath, setFocusDataPath] = useState();
    const dpRef = useRef();

    useEffect(() => {
      if (focusDataPath) {
        dpRef.current.focus();
        setFocusDataPath(false);
      }
    }, [focusDataPath]);

    if (value === '' || value?.[0] === '{')
      return (
        <DataPathField
          ref={dpRef}
          name={name}
          onChange={onChange}
          value={value}
        />
      );

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
      >
        {!value && (
          <Button
            onClick={() => {
              onChange('{}');
              setFocusDataPath(true);
            }}
          >
            <Text color="text-weak">{'{}'}</Text>
          </Button>
        )}
      </ArrayProperty>
    );
  },
);

export default ColorProperty;
