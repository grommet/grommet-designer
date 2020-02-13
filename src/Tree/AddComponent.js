import React from 'react';
import ReactGA from 'react-ga';
import {
  Box,
  Button,
  Heading,
  Keyboard,
  Layer,
  Select,
  Text,
  TextInput,
} from 'grommet';
import { Close } from 'grommet-icons';
import {
  addComponent,
  addScreen,
  copyComponent,
  getParent,
  insertComponent,
} from '../design';
import { displayName, getComponentType } from '../utils';
import ActionButton from '../components/ActionButton';

const allLocations = ['within', 'after', 'before', 'containing'];

const AddComponent = ({
  base,
  design,
  libraries,
  selected,
  setDesign,
  setSelected,
  onClose,
}) => {
  const selectedComponent = design.components[selected.component];
  const selectedType = React.useMemo(
    () => getComponentType(libraries, selectedComponent.type),
    [libraries, selectedComponent.type],
  );
  const locations = React.useMemo(() => {
    const parent = getParent(design, selected.component);
    if (!parent) return allLocations.filter(l => l === 'within');
    if (selectedType.container) return allLocations;
    return allLocations.filter(l => l !== 'within');
  }, [design, selected.component, selectedType]);
  const [location, setLocation] = React.useState();
  React.useEffect(() => setLocation(locations[0]), [locations]);

  const [search, setSearch] = React.useState('');

  const inputRef = React.useRef();

  const templates = React.useMemo(() => {
    const buildTemplates = design => {
      const templates = {};
      Object.keys(design.components)
        .map(id => design.components[id])
        .filter(component => component.name)
        .forEach(component => {
          if (!templates[component.name]) {
            templates[component.name] = component;
          }
        });
      return { design, name: design.name, templates };
    };

    const result = [];
    if (base) {
      result.push(buildTemplates(base));
    }
    result.push(buildTemplates(design));
    return result;
  }, [base, design]);

  React.useLayoutEffect(() => {
    setTimeout(() => inputRef.current && inputRef.current.focus(), 1);
  });

  const add = ({ typeName, template, templateDesign }) => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const nextSelected = { ...selected };

    if (typeName) {
      if (typeName === 'designer.Screen') {
        addScreen(nextDesign, nextSelected);
      } else {
        addComponent(nextDesign, libraries, nextSelected, typeName);
      }
    } else if (template) {
      const id = copyComponent(nextDesign, templateDesign, template.id);
      nextDesign.components[id].name = template.name;
      nextSelected.component = id;
    }

    if (selected.screen === nextSelected.screen) {
      insertComponent({
        nextDesign,
        libraries,
        selected,
        id: nextSelected.component,
        location,
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
          <Select
            name="add-location"
            options={locations}
            disabled={locations.length === 1}
            value={location}
            onChange={event => setLocation(event.value)}
            valueLabel={
              <Box pad="small">
                <Text>{`${location} ${displayName(selectedComponent)}`}</Text>
              </Box>
            }
          />
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
                    if (typeName) {
                      add({
                        typeName,
                        containSelected: event.metaKey,
                      });
                    }
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
                              add({
                                typeName: `${libraryName}.${name}`,
                                containSelected: event.metaKey,
                              })
                            }
                          >
                            <Box
                              pad={{ horizontal: 'small', vertical: 'xsmall' }}
                            >
                              {components[name].name}
                            </Box>
                          </Button>
                        ))}
                  </Box>
                )),
            )}

            {templates
              .filter(
                ({ templates }) =>
                  !searchExp ||
                  Object.keys(templates).some(name => name.match(searchExp)),
              )
              .map(({ name, design: tempDesign, templates: temps }) => (
                <Box key={name} flex={false}>
                  <Box pad={{ horizontal: 'small', vertical: 'xsmall' }}>
                    <Heading level="3" size="small" margin="none">
                      {name}
                    </Heading>
                  </Box>
                  {Object.keys(temps)
                    .filter(name => !searchExp || name.match(searchExp))
                    .map(name => (
                      <Button
                        key={name}
                        hoverIndicator
                        onClick={event =>
                          add({
                            containSelected: event.metaKey,
                            templateDesign: tempDesign,
                            template: temps[name],
                          })
                        }
                      >
                        <Box pad={{ horizontal: 'small', vertical: 'xsmall' }}>
                          {name}
                        </Box>
                      </Button>
                    ))}
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
    </Layer>
  );
};

export default AddComponent;
