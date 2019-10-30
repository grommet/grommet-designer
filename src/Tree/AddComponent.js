import React from 'react';
import ReactGA from 'react-ga';
import { Box, Button, Heading, Keyboard, Layer, TextInput } from 'grommet';
import { Close } from 'grommet-icons';
import { addScreen, copyComponent, getParent } from '../design';
import ActionButton from '../components/ActionButton';
import { getComponentType } from '../utils';

const AddComponent = ({
  design,
  libraries,
  selected,
  setDesign,
  setSelected,
  onClose,
}) => {
  const [search, setSearch] = React.useState('');
  const inputRef = React.useRef();

  React.useLayoutEffect(() => {
    setTimeout(() => inputRef.current && inputRef.current.focus(), 1);
  });

  const onAdd = (typeName, containSelected, starter) => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const nextSelected = { ...selected };
    const type = getComponentType(libraries, typeName);

    if (type.name === 'Screen') {
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

      if (selected.component) {
        const selectedComponent = nextDesign.components[selected.component];
        if (containSelected && type.container) {
          const parent = getParent(nextDesign, selected.component);
          const index = parent.children.indexOf(selected.component);
          parent.children[index] = id;
          component.children = [selected.component];
        } else {
          const selectedType = getComponentType(
            libraries,
            selectedComponent.type,
          );
          const parent = selectedType.container
            ? selectedComponent
            : getParent(nextDesign, selected.component);
          if (!parent.children) parent.children = [];
          parent.children.push(id);
        }
      } else {
        const screen = nextDesign.screens[selected.screen];
        screen.root = id;
      }
      nextSelected.component = id;

      // Special case any -component- properties by adding separate components
      // for them. Canvas will take care of rendering them.
      // Tree will show them so the user can select them.
      Object.keys(type.properties).forEach(prop => {
        if (
          typeof type.properties[prop] === 'string' &&
          type.properties[prop].startsWith('-component-')
        ) {
          const [, propTypeName] = type.properties[prop].split(' ');
          const propType = getComponentType(libraries, propTypeName);
          const propId = nextDesign.nextId;
          nextDesign.nextId += 1;
          const propComponent = {
            type: propTypeName,
            name: prop,
            id: propId,
            props: { ...propType.defaultProps, name: prop },
            deletable: false,
          };
          nextDesign.components[propComponent.id] = propComponent;
          if (!component.propComponents) component.propComponents = [];
          component.propComponents.push(propId);
          component.props[prop] = propId;
        }
      });
    }

    setDesign(nextDesign);
    setSelected(nextSelected);
    onClose();

    ReactGA.event({
      category: 'edit',
      action: 'add component',
      label: typeName,
    });
  };

  const searchExp = search ? new RegExp(`^${search}`, 'i') : undefined;

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
        <Box flex={false} direction="row" justify="between" align="center">
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
            onEnter={
              searchExp
                ? event => {
                    // find first match
                    let typeName;
                    libraries.some(({ name, components }) => {
                      const first = Object.keys(components).filter(n =>
                        n.match(searchExp),
                      )[0];
                      if (first) typeName = `${name}.${first}`;
                      return !!typeName;
                    });
                    onAdd(typeName, event.metaKey);
                  }
                : undefined
            }
          >
            <TextInput
              ref={inputRef}
              value={search}
              onChange={event => setSearch(event.target.value)}
            />
          </Keyboard>
        </Box>
        <Box flex overflow="auto">
          <Box flex={false} gap="medium" margin={{ bottom: 'medium' }}>
            {libraries.map(({ name: libraryName, components, structure }) =>
              structure
                .filter(
                  ({ components: names }) =>
                    !searchExp || names.some(name => name.match(searchExp)),
                )
                .map(({ name, Icon, components: names }) => (
                  <Box key={name} flex={false}>
                    <Box
                      direction="row"
                      gap="medium"
                      align="center"
                      justify="between"
                      pad={{ horizontal: 'small', vertical: 'xsmall' }}
                    >
                      <Heading level={4} size="small" margin="none">
                        {name}
                      </Heading>
                      {Icon && <Icon color="dark-4" />}
                    </Box>
                    {names &&
                      names
                        .filter(name => !searchExp || name.match(searchExp))
                        .map(name => (
                          <Button
                            key={name}
                            hoverIndicator
                            onClick={event =>
                              onAdd(`${libraryName}.${name}`, event.metaKey)
                            }
                          >
                            <Box
                              pad={{ horizontal: 'small', vertical: 'xsmall' }}
                            >
                              {components[name].name}
                            </Box>
                          </Button>
                        ))}
                    {/* }
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
                { */}
                  </Box>
                )),
            )}
          </Box>
        </Box>
      </Box>
    </Layer>
  );
};

export default AddComponent;
