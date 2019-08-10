import React from 'react';
import { Box, Button, Heading, Keyboard, Layer, TextInput } from 'grommet';
import { BarChart, Blank, Bold, Capacity, CheckboxSelected, Image, Navigate } from 'grommet-icons';
import { Close } from 'grommet-icons';
import { types } from '../types';
import { addScreen, getParent } from '../design';
import ActionButton from '../components/ActionButton';

const structure = [
  { name: 'Layout', Icon: Capacity, types: ['Box', 'Grid', 'Stack', 'Layer'] },
  { name: 'Typography', Icon: Bold, types: ['Heading', 'Paragraph', 'Text', 'Markdown', 'Icon'] },
  { name: 'Controls', Icon: Navigate, types: ['Anchor', 'Button', 'Menu'] },
  { name: 'Input', Icon: CheckboxSelected, types: ['CheckBox', 'Form', 'FormField', 'Select', 'TextArea', 'TextInput'] },
  { name: 'Visualizations', Icon: BarChart, types: ['Calendar', 'Clock', 'DataTable', 'Meter'] },
  { name: 'Media', Icon: Image, types: ['Image'] },
  { name: 'Design', Icon: Blank, types: ['Repeater', 'Reference', 'Screen'] },
];

const onAdd = (typeName, design, selected, onChange, onClose) => {
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
  onClose();
}

const AddComponent = ({ design, selected, onChange, onClose }) => {
  const [search, setSearch] = React.useState('');
  const [searchTypes, setSearchTypes] = React.useState();

  const inputRef = React.useRef();

  React.useLayoutEffect(() => {
    setTimeout(() => (inputRef.current && inputRef.current.focus()), 1);
  });

  return (
    <Layer
      position="top-left"
      margin="medium"
      full="vertical"
      animation="fadeIn"
      onEsc={onClose}
      onClickOutside={onClose}
    >
      <Box flex elevation="medium">
        <Box
          flex={false}
          direction="row"
          justify="between"
          align="center"
        >
          <ActionButton title="close" icon={<Close />} onClick={onClose} />
          <Heading
            level={2}
            size="small"
            margin={{ vertical: 'none', horizontal: 'small' }}
          >
            add
          </Heading>
        </Box>
        <Box flex={false} pad="small">
          <Keyboard
            onEnter={() => {
              if (searchTypes) {
                onAdd(searchTypes[0], design, selected, onChange, onClose)
              }
            }}
          >
            <TextInput
              ref={inputRef}
              value={search}
              onChange={(event) => {
                const nextSearch = event.target.value;
                setSearch(nextSearch);
                if (nextSearch) {
                  const exp = new RegExp(`^${nextSearch}`, 'i');
                  setSearchTypes(Object.keys(types).filter(k => k.match(exp)));
                } else {
                  setSearchTypes(undefined);
                }
              }}
            />
          </Keyboard>
        </Box>
        <Box flex overflow="auto">
          <Box flex={false} gap="medium" margin={{ bottom: 'medium' }}>
            {!searchTypes && structure.map(({ name, Icon, types: sectionTypes }) => (
              <Box key={name} flex={false}>
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
                    onClick={() => onAdd(key, design, selected, onChange, onClose)}
                  >
                    <Box pad={{ horizontal: 'small', vertical: 'xsmall' }}>
                      {types[key].name}
                    </Box>
                  </Button>
                ))}
              </Box>
            ))}
            {searchTypes && searchTypes.map(key => (
              <Button
                key={key}
                hoverIndicator
                onClick={() => onAdd(key, design, selected, onChange, onClose)}
              >
                <Box pad={{ horizontal: 'small', vertical: 'xsmall' }}>
                  {types[key].name}
                </Box>
              </Button>
            ))}
          </Box>
        </Box>
      </Box>
    </Layer>
  );
}

export default AddComponent;
