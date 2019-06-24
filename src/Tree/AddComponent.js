import React from 'react';
import { Box, Button, Grid, Heading, Layer } from 'grommet';
import { Close } from 'grommet-icons';
import { types } from '../types';
import { addScreen, getParent } from '../designs';

const structure = [
  { name: 'Layout', types: ['Box', 'Grid', 'Stack', 'Layer'] },
  { name: 'Typography', types: ['Heading', 'Paragraph', 'Text', 'Markdown', 'Icon'] },
  { name: 'Controls', types: ['Anchor', 'Button', 'Menu'] },
  { name: 'Input', types: ['CheckBox', 'Form', 'FormField', 'Select', 'TextArea', 'TextInput'] },
  { name: 'Visualizations', types: ['Calendar', 'Clock', 'DataTable', 'Meter'] },
  { name: 'Media', types: ['Image'] },
  { name: 'Design', types: ['Repeater', 'Reference', 'Screen'] },
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
      <Box flex={false} direction="row" justify="between" align="center">
        <Box flex >
          <Button fill icon={<Close />} hoverIndicator onClick={onClose} />
        </Box>
        <Heading
          level={2}
          size="small"
          margin={{ vertical: 'none', horizontal: 'medium' }}
        >
          add
        </Heading>
      </Box>
      <Box flex pad="medium" overflow="auto">
        <Grid columns="small" gap="medium">
          {structure.map(({ name, types: sectionTypes }) => (
            <Box key={name} flex={false} border="top">
              <Heading
                level={4}
                size="small"
                margin={{ horizontal: 'small', vertical: 'xsmall' }}
              >
                {name}
              </Heading>
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
