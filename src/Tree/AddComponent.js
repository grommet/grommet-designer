import React from 'react';
import { Box, Button, Grid, Heading, Layer } from 'grommet';
import { BarChart, Blank, Bold, Capacity, CheckboxSelected, Image, Navigate } from 'grommet-icons';
import { Close } from 'grommet-icons';
import { types } from '../types';
import { addScreen, getParent } from '../design';
import ActionButton from '../ActionButton';

const structure = [
  { name: 'Layout', Icon: Capacity, types: ['Box', 'Grid', 'Stack', 'Layer'] },
  { name: 'Typography', Icon: Bold, types: ['Heading', 'Paragraph', 'Text', 'Markdown', 'Icon'] },
  { name: 'Controls', Icon: Navigate, types: ['Anchor', 'Button', 'Menu'] },
  { name: 'Input', Icon: CheckboxSelected, types: ['CheckBox', 'Form', 'FormField', 'Select', 'TextArea', 'TextInput'] },
  { name: 'Visualizations', Icon: BarChart, types: ['Calendar', 'Clock', 'DataTable', 'Meter'] },
  { name: 'Media', Icon: Image, types: ['Image'] },
  { name: 'Design', Icon: Blank, types: ['Repeater', 'Reference', 'Screen'] },
];

const onAdd = (typeName, design, selected, onChange) => {
  const nextDesign = JSON.parse(JSON.stringify(design));
  const nextSelected = { ...selected };
  if (typeName === 'Screen') {
    nextSelected.screen = addScreen(nextDesign);
    nextSelected.component = nextDesign.screens[nextSelected.screen].root;
  } else {
    const type = types[typeName];
    const id = nextDesign.nextId;
    nextDesign.nextId += 1;
    const component = {
      type: typeName,
      id,
      props: type.defaultProps ? { ...type.defaultProps } : {},
    };
    nextDesign.components[component.id] = component;
    const selectedComponent = nextDesign.components[selected.component];
    const selectedType = types[selectedComponent.type];
    const parent = selectedType.container
      ? selectedComponent : getParent(nextDesign, selected.component)
    if (!parent.children) parent.children = [];
    parent.children.push(component.id);
    nextSelected.component = component.id;
  }
  onChange({ design: nextDesign, selected: nextSelected });
}

const AddComponent = ({ design, selected, onChange, onClose }) => (
  <Layer
    full
    margin="medium"
    onEsc={onClose}
    onClickOutside={onClose}
  >
    <Box flex background="dark-1">
      <Box
        flex={false}
        direction="row"
        justify="between"
        align="center"
        pad="small"
      >
        <ActionButton icon={<Close />} onClick={onClose} />
        <Heading
          level={2}
          size="small"
          margin={{ vertical: 'none', horizontal: 'small' }}
        >
          add
        </Heading>
      </Box>
      <Box flex pad="medium" overflow="auto">
        <Grid columns="small" gap="medium">
          {structure.map(({ name, Icon, types: sectionTypes }) => (
            <Box key={name} flex={false} border="top">
              <Box
                direction="row"
                gap="medium"
                align="center"
                justify="between"
                pad={{ horizontal: 'small', vertical: 'xsmall' }}
              >
                <Heading
                  level={4}
                  size="small"
                  margin="none"
                >
                  {name}
                </Heading>
                <Icon color="dark-4" />
              </Box>
              {sectionTypes.map(key => (
                <Button
                  key={key}
                  hoverIndicator
                  onClick={() => onAdd(key, design, selected, onChange)}
                >
                  <Box pad={{ horizontal: 'small', vertical: 'xsmall' }}>
                    {types[key].name}
                  </Box>
                </Button>
              ))}
            </Box>
          ))}
        </Grid>
      </Box>
    </Box>
  </Layer>
);

export default AddComponent;
