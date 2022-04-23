import React, { useContext } from 'react';
import { Box, Text } from 'grommet';
import {
  getComponent,
  getDescendants,
  getDesign,
  getName,
  getRoot,
} from '../design2';
import SelectionContext from '../SelectionContext';
import ArrayProperty from './ArrayProperty';

const getLinkOptions = (id) => {
  // options for what a Button or MenuItem should do:
  // open a layer, close the layer it is in, change screens, cycle Alternative
  const root = getRoot(id);
  const screenComponents = root ? getDescendants(root) : [];
  const screens = getDesign().screens;
  return [
    ...screenComponents
      .map((k) => getComponent(k))
      .filter((c) => c)
      // .filter((c) => {
      //   let type;
      //   // if this is a reference, check the target type
      //   if (c.type === 'designer.Reference') {
      //     const referencedComponent = design.components[c.props.component];
      //     if (referencedComponent)
      //       type = getComponentType(libraries, referencedComponent.type);
      //   } else {
      //     type = getComponentType(libraries, c.type);
      //   }
      //   // must have a name
      //   return (type?.hideable || type?.selectable) && c.name;
      // })
      .map((c) => ({
        screen: root,
        component: c.id,
        type: c.type,
        label: getName(c.id),
        key: c.id,
      })),
    ...Object.keys(screens)
      .map((k) => screens[k])
      .map((s) => ({
        screen: s.id,
        label: getName(s.id),
        key: s.id,
      })),
    {
      control: 'toggleThemeMode',
      label: '-toggle theme mode-',
      key: 'toggleThemeMode',
    },
  ];
};

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
    <Box pad="small">
      <Text weight={selected ? 'bold' : undefined}>{label}</Text>
    </Box>
  );
};

const LinkProperty = React.forwardRef(({ name, onChange, value }, ref) => {
  const [selection] = useContext(SelectionContext);
  const linkOptions = getLinkOptions(selection);
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
