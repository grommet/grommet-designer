import React, { Fragment } from 'react';
import { Box, Button, Heading, Keyboard, Layer, TextInput } from 'grommet';
import { BarChart, Blank, Bold, Capacity, CheckboxSelected, Domain, Image, Navigate } from 'grommet-icons';
import { Close } from 'grommet-icons';
import { types } from '../types';
import { addScreen, copyComponent, getParent } from '../design';
import ActionButton from '../components/ActionButton';

const structure = [
  { name: 'Screens', Icon: Domain, starters: ['Screen'] },
  { name: 'Boxes', Icon: Domain, starters: ['Box'] },
  { name: 'Layout', Icon: Capacity, types: ['Box', 'Grid', 'Stack', 'Layer'] },
  { name: 'Typography', Icon: Bold, types: ['Heading', 'Paragraph', 'Text', 'Markdown', 'Icon'] },
  { name: 'Controls', Icon: Navigate, types: ['Anchor', 'Button', 'Menu'] },
  { name: 'Input', Icon: CheckboxSelected, types: ['CheckBox', 'Form', 'FormField', 'Select', 'TextArea', 'TextInput'] },
  { name: 'Visualizations', Icon: BarChart, types: ['Calendar', 'Clock', 'DataTable', 'Meter'] },
  { name: 'Media', Icon: Image, types: ['Image'] },
  { name: 'Design', Icon: Blank, types: ['Repeater', 'Reference', 'Screen'] },
];

const AddComponent = ({ design, selected, onChange, onClose }) => {
  const [search, setSearch] = React.useState('');
  const [searchMatches, setSearchMatches] = React.useState();

  const inputRef = React.useRef();

  React.useLayoutEffect(() => {
    setTimeout(() => (inputRef.current && inputRef.current.focus()), 1);
  });

  const onAdd = (typeName, containSelected, starter) => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const nextSelected = { ...selected };
    const type = types[typeName];
    if (typeName === 'Screen') {
      nextSelected.screen = addScreen(nextDesign, starter, selected);
      nextSelected.component = nextDesign.screens[nextSelected.screen].root;
    } else {
      let id;
      if (starter) {
        id = copyComponent(nextDesign, starter, starter.root);
        nextDesign.components[id].name = starter.name;
      } else {
        id = nextDesign.nextId;
        nextDesign.nextId += 1;
        const component = {
          type: typeName,
          id,
          props: type.defaultProps ? { ...type.defaultProps } : {},
        };
        nextDesign.components[component.id] = component;
      }
      const component = nextDesign.components[id];

      const selectedComponent = nextDesign.components[selected.component];
      if (containSelected && type.container) {
        const parent = getParent(nextDesign, selected.component);
        const index = parent.children.indexOf(selected.component);
        parent.children[index] = id;
        component.children = [selected.component];
        if (component.type === 'Button') {
          delete component.props.label; // so contents are revealed
        }
      } else {
        const selectedType = types[selectedComponent.type];
        const parent = selectedType.container
          ? selectedComponent : getParent(nextDesign, selected.component)
        if (!parent.children) parent.children = [];
        parent.children.push(id);
      }
      nextSelected.component = id;

      // Special case DropButton dropContent as a child in the Tree
      // but not in the Canvas. We handle this by putting the id of the
      // dropContent component in the DropButton's dropContentId property value.
      // Canvas knows what to do.
      if (typeName === 'DropButton') {
        const boxType = types.Box;
        const dropContentId = nextDesign.nextId;
        nextDesign.nextId += 1;
        const dropContent = {
          type: boxType.name,
          id: dropContentId,
          props: { ...boxType.defaultProps, name: 'dropContent' },
        };
        nextDesign.components[dropContent.id] = dropContent;
        component.children = [dropContentId];
        component.props.dropContentId = dropContentId;
      }
    }
    onChange({ design: nextDesign, selected: nextSelected });
    onClose();
  }

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
            onEnter={searchMatches
              ? () => onAdd(
                searchMatches[0].type,
                false,
                searchMatches[0].starters && searchMatches[0].starters[0]
              ) : undefined
            }
          >
            <TextInput
              ref={inputRef}
              value={search}
              onChange={(event) => {
                const nextSearch = event.target.value;
                setSearch(nextSearch);
                if (nextSearch) {
                  const exp = new RegExp(`^${nextSearch}`, 'i');
                  setSearchMatches(
                    Object.keys(types).map(type => types[type])
                    .filter(type => type.starters
                      && type.starters.some(s => s.name.match(exp)))
                    .map(type => {
                      return {
                        type: type.name,
                        starters: type.starters.filter(s => s.name.match(exp)),
                      };
                    })
                    .concat(
                      Object.keys(types)
                      .filter(type => type.match(exp))
                      .map(type => ({ type }))
                    )
                  );
                } else {
                  setSearchMatches(undefined);
                }
              }}
            />
          </Keyboard>
        </Box>
        <Box flex overflow="auto">
          {!searchMatches && (
            <Box flex={false} gap="medium" margin={{ bottom: 'medium' }}>
              {structure.map(
                ({ name, Icon, starters, types: sectionTypes }) => (
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
                  {sectionTypes && sectionTypes.map(key => (
                    <Button
                      key={key}
                      hoverIndicator
                      onClick={(event) => onAdd(key, event.metaKey)}
                    >
                      <Box pad={{ horizontal: 'small', vertical: 'xsmall' }}>
                        {types[key].name}
                      </Box>
                    </Button>
                  ))}
                  {starters && starters.map(key => (
                    <Fragment key={key}>
                      {types[key].starters.map(starter => (
                        <Button
                          key={starter.name}
                          hoverIndicator
                          onClick={(event) => onAdd(key, event.metaKey, starter)}
                        >
                          <Box pad={{ horizontal: 'small', vertical: 'xsmall' }}>
                            {starter.name}
                          </Box>
                        </Button>
                      ))}
                    </Fragment>
                  ))}
                </Box>
              ))}
            </Box>
          )}
          {searchMatches && (
            <Box flex={false}>
              {searchMatches.map(({ type, starters }) => {
                if (starters) {
                  return starters.map(starter => (
                    <Button
                      key={starter.name}
                      hoverIndicator
                      onClick={(event) => onAdd(type, event.metaKey, starter)}
                    >
                      <Box pad={{ horizontal: 'small', vertical: 'xsmall' }}>
                        {starter.name}
                      </Box>
                    </Button>
                  ));
                } else {
                  return (
                    <Button
                      key={type}
                      hoverIndicator
                      onClick={(event) => onAdd(type, event.metaKey)}
                    >
                      <Box pad={{ horizontal: 'small', vertical: 'xsmall' }}>
                        {types[type].name}
                      </Box>
                    </Button>
                  );
                }
              })}
            </Box>
          )}
        </Box>
      </Box>
    </Layer>
  );
}

export default AddComponent;
