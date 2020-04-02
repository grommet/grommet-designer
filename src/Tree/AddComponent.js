import React from 'react';
import ReactGA from 'react-ga';
import {
  Anchor,
  Box,
  Button,
  Header,
  Heading,
  Keyboard,
  Layer,
  TextInput,
} from 'grommet';
import { Close, Next } from 'grommet-icons';
import {
  addComponent,
  addScreen,
  copyComponent,
  copyScreen,
  insertComponent,
} from '../design';
import ActionButton from '../components/ActionButton';
import AddLocation from './AddLocation';
import AddMethod from './AddMethod';

const AddButton = ({ label, onClick }) => (
  <Button hoverIndicator onClick={onClick}>
    <Box pad={{ horizontal: 'small', vertical: 'xsmall' }}>{label}</Box>
  </Button>
);

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
  const starters = React.useMemo(() => {
    const result = {};
    libraries
      .filter(l => l.starters)
      .forEach(({ starters }) => {
        // find all screen and components that have names
        const type = 'designer.Screen';
        Object.keys(starters.screens)
          .map(id => starters.screens[id])
          .filter(s => s.name)
          .forEach(screen => {
            if (!result[type]) result[type] = [];
            result[type] = [
              ...result[type],
              { id: screen.id, name: screen.name, starters },
            ];
          });
        Object.keys(starters.components)
          .map(id => starters.components[id])
          .filter(c => c.name)
          .forEach(component => {
            if (!result[component.type]) result[component.type] = [];
            result[component.type] = [
              ...result[component.type],
              { id: component.id, name: component.name, starters },
            ];
          });
      });
    return result;
  }, [libraries]);
  const [addTypeName, setAddTypeName] = React.useState();
  const [addStarters, setAddStarters] = React.useState();
  const [addLocation, setAddLocation] = React.useState();

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

  const add = ({ typeName, starter, template, templateDesign, url }) => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const nextSelected = { ...selected };

    if (typeName) {
      if (typeName === 'designer.Screen') {
        if (starter && starter !== 'default') {
          copyScreen(nextDesign, nextSelected, starter);
        } else {
          addScreen(nextDesign, nextSelected);
        }
      } else {
        if (starter && starter !== 'default') {
          const id = copyComponent({
            nextDesign,
            templateDesign: starter.starters,
            id: starter.id,
            screen: nextSelected.screen,
          });
          nextDesign.components[id].name = starter.name;
          nextSelected.component = id;
        } else {
          addComponent(nextDesign, libraries, nextSelected, typeName);
        }
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
        location: addLocation,
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

  const searchExp = search ? new RegExp(search, 'i') : undefined;

  const Library = ({ name: libraryName, components, structure }) =>
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
              .map(name => {
                const typeName = `${libraryName}.${name}`;
                let content = (
                  <AddButton
                    key={name}
                    label={components[name].name}
                    onClick={event =>
                      add({
                        typeName,
                        containSelected: event.metaKey || event.ctrlKey,
                      })
                    }
                  />
                );
                if (starters[typeName]) {
                  content = (
                    <Box key={name} direction="row" align="center">
                      <Box flex="grow">{content}</Box>
                      <Button
                        icon={<Next />}
                        hoverIndicator
                        onClick={() => {
                          setAddTypeName(typeName);
                          setAddStarters(starters[typeName]);
                        }}
                      />
                    </Box>
                  );
                }
                return content;
              })}
        </Box>
      ));

  const Template = ({ name, design: tempDesign, templates: temps, url }) => (
    <Box key={name} flex={false} border="top">
      <Box
        pad={{ horizontal: 'small', vertical: 'xsmall' }}
        margin={{ top: 'small' }}
      >
        <Heading level="3" size="small" margin="none">
          {url ? (
            <Anchor target="_blank" href={`${url}&mode=edit`} label={name} />
          ) : (
            name
          )}
        </Heading>
      </Box>
      {Object.keys(temps)
        .filter(name => !searchExp || name.match(searchExp))
        .map(name => (
          <AddButton
            key={name}
            label={name}
            onClick={event =>
              add({
                containSelected: event.metaKey || event.ctrlKey,
                templateDesign: tempDesign,
                template: temps[name],
                url,
              })
            }
          />
        ))}
      <Box pad="small">
        <AddMethod id={name} value={addMode} onChange={setAddMode} />
      </Box>
    </Box>
  );

  const Components = () => (
    <Box flex={false} gap="medium" margin={{ bottom: 'medium' }}>
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

      {libraries.map(library => (
        <Library {...library} />
      ))}

      {templates
        .filter(
          ({ templates }) =>
            !searchExp ||
            Object.keys(templates).some(name => name.match(searchExp)),
        )
        .map(template => (
          <Template {...template} />
        ))}
    </Box>
  );

  const Starters = () => (
    <Box flex={false}>
      <Header pad={{ horizontal: 'small', vertical: 'xsmall' }}>
        <Heading level={4} size="small" margin="none">
          {addTypeName}
        </Heading>
        <Button
          icon={<Close />}
          hoverIndicator
          onClick={() => setAddStarters(undefined)}
        />
      </Header>
      {addStarters.map(starter => (
        <AddButton
          key={starter.name}
          label={starter.name}
          onClick={event =>
            add({
              typeName: addTypeName,
              containSelected: event.metaKey || event.ctrlKey,
              starter,
            })
          }
        />
      ))}
    </Box>
  );

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
              onChange={nextAddLocation => {
                setAddLocation(nextAddLocation);
                inputRef.current.focus();
              }}
            />
          </Box>
        )}
        <Box flex overflow="auto">
          {addStarters ? <Starters /> : <Components />}
        </Box>
      </Box>
    </Layer>
  );
};

export default AddComponent;
