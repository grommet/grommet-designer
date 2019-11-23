import React from 'react';
import {
  Box,
  Button,
  CheckBox,
  Heading,
  Layer,
  MaskedInput,
  // RadioButtonGroup,
  Select,
  Text,
  TextInput,
  ThemeContext,
} from 'grommet';
import { Close, FormDown, FormUp } from 'grommet-icons';
import {
  names as iconNames,
  SelectLabel as IconLabel,
} from '../libraries/designer/Icon';
import ActionButton from '../components/ActionButton';
import Field from '../components/Field';

const internalColors = ['focus', 'icon', 'placeholder', 'selected'];

const ColorLabel = theme => ({ active, value }) => (
  <Box pad="small" direction="row" gap="small" align="center">
    <ThemeContext.Extend value={theme}>
      <Box pad="small" background={value} />
    </ThemeContext.Extend>
    <Text weight={active ? 'bold' : undefined}>{value}</Text>
  </Box>
);

const LinkLabel = design => ({ active, value }) => (
  <Box pad="small">
    <Text weight={active ? 'bold' : undefined}>
      {(value === 'undefined' && 'undefined') || (value && value.label) || ''}
    </Text>
  </Box>
);

const OptionLabel = ({ active, value }) => (
  <Box pad="small">
    <Text weight={active ? 'bold' : undefined}>
      {(typeof value !== 'string' ? JSON.stringify(value) : value) || ''}
    </Text>
  </Box>
);

const jsonValue = value => {
  if (typeof value === 'string') {
    return value;
  }
  return JSON.stringify(value);
};

const Property = React.forwardRef((props, ref) => {
  const {
    design,
    first,
    linkOptions,
    name,
    property,
    theme,
    value,
    onChange,
  } = props; // need props for CustomProperty
  const baseTheme = React.useContext(ThemeContext);
  const [stringValue, setStringValue] = React.useState(value || '');
  const [expand, setExpand] = React.useState();
  const [searchText, setSearchText] = React.useState('');
  const searchExp = React.useMemo(
    () => searchText && new RegExp(`^${searchText}`, 'i'),
    [searchText],
  );
  const [dropTarget, setDropTarget] = React.useState();
  const fieldRef = React.useCallback(node => setDropTarget(node), []);
  let debounceTimer;

  if (Array.isArray(property)) {
    const isColor = property.includes('-color-');
    let options = property;
    let Label;
    if (isColor) {
      const merged = { ...baseTheme.global.colors, ...theme.global.colors };
      options = Object.keys(merged)
        .filter(c => !internalColors.includes(c))
        .sort();
      Label = ColorLabel(theme);
    }
    const isIcon = property.includes('-Icon-');
    if (isIcon) {
      options = iconNames;
      Label = IconLabel;
    }
    const isLink = property.includes('-link-');
    if (isLink) {
      options = linkOptions;
      Label = LinkLabel(design);
    }
    if (!Label) Label = OptionLabel;

    // if (options.length <= 5) {
    //   // use a RadioButtonGroup
    //   return (
    //     <Field
    //       key={name}
    //       ref={fieldRef}
    //       first={first}
    //       label={name}
    //       htmlFor={name}
    //     >
    //       <RadioButtonGroup
    //         ref={ref}
    //         id={name}
    //         name={name}
    //         flex="shrink"
    //         direction="row"
    //         gap="none"
    //         margin={{ horizontal: 'small' }}
    //         options={options}
    //         value={typeof value === 'boolean' ? value.toString() : value || ''}
    //         onChange={(event) => {
    //           const option = event.target.value;
    //           onChange(option === 'undefined' ? undefined : option);
    //         }}
    //       >
    //         {(option, { checked, hover }) => (
    //           <Box
    //             pad="xsmall"
    //             background={(hover && !checked) ? 'dark-2' : undefined}
    //           >
    //             <Text
    //               truncate
    //               color={checked ? 'brand' : (hover ? 'white' : 'dark-4')}
    //             >
    //               {option}
    //             </Text>
    //           </Box>
    //         )}
    //       </RadioButtonGroup>
    //     </Field>
    //   );
    // }

    if (searchExp) {
      options = options.filter(p => searchExp.test(p));
    }
    if (value) {
      options = [...options, 'undefined'];
    }

    return (
      <Field
        key={name}
        ref={fieldRef}
        first={first}
        label={name}
        htmlFor={name}
      >
        <Select
          ref={ref}
          plain
          dropTarget={dropTarget}
          id={name}
          name={name}
          options={options}
          value={typeof value === 'boolean' ? value.toString() : value || ''}
          valueLabel={<Label value={value} active />}
          onChange={({ option }) => {
            setSearchText(undefined);
            onChange(option === 'undefined' ? undefined : option);
          }}
          onSearch={
            options.length > 20 || searchExp
              ? nextSearchText => setSearchText(nextSearchText)
              : undefined
          }
        >
          {option => <Label value={option} active={option === value} />}
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
          value={stringValue}
          onChange={event => {
            const nextValue = event.target.value;
            setStringValue(nextValue);
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => onChange(nextValue), 500);
          }}
          style={{ textAlign: 'end' }}
        />
      </Field>
    );
  } else if (typeof property === 'number') {
    return (
      <Field key={name} first={first} label={name} htmlFor={name}>
        <MaskedInput
          ref={ref}
          id={name}
          name={name}
          plain
          mask={[
            {
              regexp: /^\d*$/,
            },
          ]}
          value={stringValue}
          onChange={event => {
            const nextValue = event.target.value;
            setStringValue(nextValue);
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => onChange(nextValue), 500);
          }}
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
            onChange={event => onChange(event.target.checked)}
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
              {value && (
                <Text weight="bold" truncate>
                  {jsonValue(value)}
                </Text>
              )}
              <Box flex={false} pad="small">
                {expand ? (
                  <FormUp color="control" />
                ) : (
                  <FormDown color="control" />
                )}
              </Box>
            </Box>
          </Field>
        </Button>
        {expand && (
          <Box pad={{ left: 'medium' }} border="bottom">
            {Object.keys(property).map(key => (
              <Property
                key={key}
                name={key}
                property={property[key]}
                theme={theme}
                value={(value || {})[key]}
                onChange={subValue => {
                  let nextValue = { ...(value || {}) };
                  if (subValue !== undefined && subValue !== '')
                    nextValue[key] = subValue;
                  else delete nextValue[key];
                  onChange(
                    Object.keys(nextValue).length > 0 ? nextValue : undefined,
                  );
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    );
  } else if (typeof property === 'function') {
    const CustomProperty = property;
    if (property.inline) {
      return (
        <Field
          key={name}
          ref={fieldRef}
          first={first}
          label={name}
          htmlFor={name}
        >
          <CustomProperty theme={theme} linkOptions={linkOptions} {...props} />
        </Field>
      );
    }
    return (
      <Box key={name}>
        <Button ref={ref} hoverIndicator onClick={() => setExpand(!expand)}>
          <Field label={name} first={first}>
            <Box direction="row" align="center" gap="small">
              {value && (
                <Text weight="bold" truncate>
                  {jsonValue(value)}
                </Text>
              )}
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
              <Heading margin={{ left: 'small', vertical: 'none' }} level={3}>
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
                <CustomProperty
                  theme={theme}
                  linkOptions={linkOptions}
                  {...props}
                />
              </Box>
            </Box>
          </Layer>
        )}
      </Box>
    );
  }
  return null;
});

export default Property;
