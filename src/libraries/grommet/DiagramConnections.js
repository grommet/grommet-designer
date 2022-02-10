import React, { useMemo } from 'react';
import { Box, FormField, Select, TextInput } from 'grommet';
import { ThemeContext } from 'styled-components';
import { getDisplayName, getScreenForComponent } from '../../design';
import ArrayOfObjects from './ArrayOfObjects';

const Connection = ({
  value,
  onChange,
  theme,
  component,
  design,
  linkOptions,
  targetOptions,
}) => {
  const baseTheme = React.useContext(ThemeContext);

  const colorOptions = React.useMemo(() => {
    const merged = { ...baseTheme.global.colors, ...theme.global.colors };
    const names = Object.keys(merged).sort();
    names.push('undefined');
    return names;
  }, [baseTheme.global.colors, theme.global.colors]);

  const set = (name, valueArg) => {
    const nextValue = JSON.parse(JSON.stringify(value));
    if (valueArg === 'undefined') delete nextValue[name];
    else nextValue[name] = valueArg;
    onChange(nextValue);
  };

  return (
    <Box flex="grow" align="stretch" margin={{ bottom: 'medium' }}>
      <FormField label="fromTarget">
        <Select
          options={targetOptions}
          labelKey="label"
          valueKey={{ key: 'target', reduce: true }}
          value={value.fromTarget || ''}
          onChange={({ value: nextValue }) => set('fromTarget', nextValue)}
        />
      </FormField>
      <FormField label="toTarget">
        <Select
          options={targetOptions}
          labelKey="label"
          valueKey={{ key: 'target', reduce: true }}
          value={value.toTarget || ''}
          onChange={({ value: nextValue }) => set('toTarget', nextValue)}
        />
      </FormField>
      <FormField label="anchor">
        <Select
          options={['center', 'vertical', 'horizontal', 'undefined']}
          value={value.anchor || ''}
          onChange={({ option }) => set('anchor', option)}
        />
      </FormField>
      <FormField label="animation">
        <Select
          options={['pulse', 'draw', 'undefined']}
          value={value.animation || ''}
          onChange={({ option }) => set('animation', option)}
        />
      </FormField>
      <FormField label="color">
        <Select
          options={colorOptions}
          value={value.color || ''}
          onChange={({ option }) => set('color', option)}
        />
      </FormField>
      <FormField label="label">
        <TextInput
          value={value.label || ''}
          onChange={(event) => set('label', event.target.value)}
        />
      </FormField>
      <FormField label="offset">
        <Select
          options={['xsmall', 'small', 'medium', 'large', 'undefined']}
          value={value.offset || ''}
          onChange={({ option }) => set('offset', option)}
        />
      </FormField>
      <FormField label="thickness">
        <Select
          options={[
            'hair',
            'xsmall',
            'small',
            'medium',
            'large',
            'xlarge',
            'undefined',
          ]}
          value={value.thickness || ''}
          onChange={({ option }) => set('thickness', option)}
        />
      </FormField>
      <FormField label="type">
        <Select
          options={['direct', 'curved', 'rectilinear', 'undefined']}
          value={value.type || ''}
          onChange={({ option }) => set('type', option)}
        />
      </FormField>
    </Box>
  );
};

// convert array of strings to be an object for editing, back if can be
const DiagramConnections = ({ value = [], onChange, ...rest }) => {
  const { component, design, linkOptions } = rest;

  // targets are any linkOptions in the same screen
  const targetOptions = useMemo(() => {
    const screen = getScreenForComponent(design, component.id);
    const options = linkOptions
      .filter((o) => o.screen === screen && o.component)
      .map((o) => ({ label: o.label, target: String(o.component) }));
    options.push({ label: 'undefined', target: 'undefined' });
    return options;
  }, [component, design, linkOptions]);

  return (
    <ArrayOfObjects
      value={value}
      name="connections"
      labelKey={(item) =>
        `${getDisplayName(design, item.fromTarget)} + ${getDisplayName(
          design,
          item.toTarget,
        )}`
      }
      Edit={Connection}
      onChange={onChange}
      targetOptions={targetOptions}
      {...rest}
    />
  );
};

export default DiagramConnections;
