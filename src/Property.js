import React from 'react';
import {
  Box, Button, CheckBox, Heading, Layer, Select, Text, TextInput, ThemeContext,
} from 'grommet';
import { Close, FormDown, FormUp } from 'grommet-icons';
import { SelectLabel as IconLabel } from './Icon';
import ActionButton from './components/ActionButton';
import Field from './components/Field';

const ColorLabel = ({ color, theme }) => (
  <Box pad="small" direction="row" gap="small" align="center">
    <ThemeContext.Extend value={theme}>
      <Box pad="small" background={color} />
    </ThemeContext.Extend>
    <Text weight="bold">{color}</Text>
  </Box>
)

const OptionLabel = ({ active, hasColor, theme, name, value }) => {
  if (hasColor && typeof value === 'string') {
    return <ColorLabel color={value} theme={theme} />;
  }
  if (name === 'icon' && typeof value === 'string') return <IconLabel icon={value} />;
  return (
    <Box pad="small">
      <Text weight={active ? "bold" : undefined}>
        {typeof value !== 'string' ? JSON.stringify(value) : value || ''}
      </Text>
    </Box>
  );
}

const jsonValue = (value) => {
  if (typeof value === 'string') {
    return value;
  }
  return JSON.stringify(value);
}

const Property = React.forwardRef((props, ref) => {
  const { first, name, property, theme, value, onChange } = props;
  const [expand, setExpand] = React.useState();
  const [searchText, setSearchText] = React.useState('');
  const [dropTarget, setDropTarget] = React.useState();
  const fieldRef = React.useCallback(node => setDropTarget(node), []);

  const searchExp = searchText && new RegExp(searchText, 'i');
  if (Array.isArray(property)) {
    const hasColor = property.includes('light-1');
    return (
      <Field key={name} ref={fieldRef} first={first} label={name} htmlFor={name}>
        <Select
          ref={ref}
          plain
          dropTarget={dropTarget}
          id={name}
          name={name}
          options={searchExp ? [...property.filter(p => searchExp.test(p)), 'undefined']
            : [...property, 'undefined']}
          value={value || ''}
          valueLabel={(
            <OptionLabel
              active
              name={name}
              hasColor={hasColor}
              theme={theme}
              value={value}
            />
          )}
          onChange={({ option }) => {
            setSearchText(undefined);
            onChange(option === 'undefined' ? undefined : option);
          }}
          onSearch={property.length > 20
            ? (nextSearchText) => setSearchText(nextSearchText) : undefined}
        >
          {(option) =>
            <OptionLabel
              name={name}
              hasColor={hasColor}
              theme={theme}
              value={option}
              active={option === value}
            />}
        </Select>
      </Field>
    );
  } else if (typeof property === 'string') {
    return (
      <Field key={name} first={first} label={name} htmlFor={name}>
        <TextInput
          ref={ref}
          id={name}
          name={name}
          plain
          value={value || ''}
          onChange={(event) => onChange(event.target.value)}
          style={{ textAlign: 'end' }}
        />
      </Field>
    );
  } else if (typeof property === 'boolean') {
    return (
      <Field key={name} first={first} label={name} htmlFor={name}>
        <Box pad="small">
          <CheckBox
            ref={ref}
            id={name}
            name={name}
            toggle
            checked={!!value}
            onChange={(event) => onChange(event.target.checked)}
          />
        </Box>
      </Field>
    );
  } else if (typeof property === 'object') {
    return (
      <Box key={name}>
        <Button ref={ref} hoverIndicator onClick={() => setExpand(!expand)}>
          <Field label={name} first={first}>
            <Box direction="row" align="center" gap="small">
              {value && <Text weight="bold" truncate>{jsonValue(value)}</Text>}
              <Box flex={false} pad="small">
              {expand
                ? <FormUp color="control" />
                : <FormDown color="control" />}
              </Box>
            </Box>
          </Field>
        </Button>
        {expand && (
          <Box pad={{ left: 'medium' }} border="bottom">
            {Object.keys(property).map((key) => (
              <Property
                key={key}
                name={key}
                property={property[key]}
                theme={theme}
                value={(value || {})[key]}
                onChange={subValue => {
                  let nextValue = { ...(value || {}) };
                  if (subValue !== undefined && subValue !== '') nextValue[key] = subValue
                  else delete nextValue[key];
                  onChange(Object.keys(nextValue).length > 0 ? nextValue : undefined);
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    );
  } else if (typeof property === 'function') {
    const CustomProperty = property;
    return (
      <Box key={name}>
        <Button ref={ref} hoverIndicator onClick={() => setExpand(!expand)}>
          <Field label={name} first={first}>
            <Box direction="row" align="center" gap="small">
              {value && <Text weight="bold" truncate>{jsonValue(value)}</Text>}
              <Box flex={false} pad="small">
                <FormDown color="control" />
              </Box>
            </Box>
          </Field>
        </Button>
        {expand && (
          <Layer
            position="right"
            margin="medium"
            animation="fadeIn"
            onEsc={() => setExpand(false)}
            onClickOutside={() => setExpand(false)}
          >
            <Box
              direction="row"
              align="center"
              justify="between"
              gap="medium"
              pad="small"
              flex={false}
            >
              <Heading margin={{ left: "small", vertical: 'none' }} level={3}>
                {name}
              </Heading>
              <ActionButton
                title="close"
                icon={<Close />}
                onClick={() => setExpand(false)}
              />
            </Box>
            <Box
              overflow="auto"
              pad={{ horizontal: 'medium', bottom: 'medium' }}
            >
              <Box flex={false}>
                <CustomProperty {...props} />
              </Box>
            </Box>
          </Layer>
        )}
      </Box>
    );
  }
  return null;
})

export default Property
