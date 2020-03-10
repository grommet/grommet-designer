import React from 'react';
import ReactGA from 'react-ga';
import {
  Anchor,
  Box,
  Button,
  Heading,
  Keyboard,
  Layer,
  TextInput,
} from 'grommet';
import { Close } from 'grommet-icons';
import {
  addComponent,
  addScreen,
  copyComponent,
  insertComponent,
} from '../design';
import ActionButton from '../components/ActionButton';
import AddLocation from './AddLocation';
import AddMethod from './AddMethod';

const AddComponent = ({
  design,
  imports,
  selected,
  setDesign,
  setSelected,
  onClose,
}) => {
  const libraries = React.useMemo(
    () => imports.filter(i => i.library).map(i => i.library),
    [imports],
  );
  const [location, setLocation] = React.useState();

  const [search, setSearch] = React.useState('');
  const [addMode, setAddMode] = React.useState();

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
    result.push(buildTemplates(design));

    imports
      .filter(i => i.design)
      .forEach(i => result.push({ ...i, ...buildTemplates(i.design) }));

    return result;
  }, [design, imports]);

  React.useLayoutEffect(() => {
    setTimeout(() => inputRef.current && inputRef.current.focus(), 1);
  });

  const add = ({ typeName, template, templateDesign, url }) => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const nextSelected = { ...selected };

    if (typeName) {
      if (typeName === 'designer.Screen') {
        addScreen(nextDesign, nextSelected);
      } else {
        addComponent(nextDesign, libraries, nextSelected, typeName);
      }
    } else if (template) {
      if (addMode === 'copy') {
        const id = copyComponent({
          nextDesign,
          templateDesign,
          id: template.id,
          screen: nextSelected.screen,
        });
        nextDesign.components[id].name = template.name;
        nextSelected.component = id;
      } else if (addMode === 'reference') {
        addComponent(nextDesign, libraries, nextSelected, 'designer.Reference');
        nextDesign.components[nextSelected.component].props.component =
          template.id;
        if (url) {
          nextDesign.components[nextSelected.component].props.design = { url };
        }
      }
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
        {selected.component && (
          <Box flex={false} pad="small">
            <AddLocation
              design={design}
              libraries={libraries}
              selected={selected}
              onChange={nextLocation => setLocation(nextLocation)}
            />
          </Box>
        )}
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
                        containSelected: event.metaKey || event.ctrlKey,
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
                      {Icon && <Icon color="text-xweak" />}
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
                                containSelected: event.metaKey || event.ctrlKey,
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
              .map(({ name, design: tempDesign, templates: temps, url }) => (
                <Box key={name} flex={false} border="top">
                  <Box
                    pad={{ horizontal: 'small', vertical: 'xsmall' }}
                    margin={{ top: 'small' }}
                  >
                    <Heading level="3" size="small" margin="none">
                      {url ? (
                        <Anchor
                          target="_blank"
                          href={`${url}&preview=false`}
                          label={name}
                        />
                      ) : (
                        name
                      )}
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
                            containSelected: event.metaKey || event.ctrlKey,
                            templateDesign: tempDesign,
                            template: temps[name],
                            url,
                          })
                        }
                      >
                        <Box pad={{ horizontal: 'small', vertical: 'xsmall' }}>
                          {name}
                        </Box>
                      </Button>
                    ))}
                  <Box pad="small">
                    <AddMethod
                      id={name}
                      value={addMode}
                      onChange={setAddMode}
                    />
                  </Box>
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
    </Layer>
  );
};

export default AddComponent;
