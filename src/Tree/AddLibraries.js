import React, { useCallback, useContext } from 'react';
import ReactGA from 'react-ga';
import { Box, Heading } from 'grommet';
import { addComponent, addScreen, getLibraries } from '../design2';
import SelectionContext from '../SelectionContext';
import AddButton from './AddButton';

const AddLibraries = ({ addOptions, onClose, searchExp }) => {
  const [selection, setSelection, { setLocation }] =
    useContext(SelectionContext);
  const libraries = getLibraries();

  const onAdd = useCallback(
    (typeName) => {
      if (typeName === 'designer.Screen') {
        const screen = addScreen(selection);
        setLocation({ screen: screen.id });
        setSelection(screen.id);
      } else {
        const component = addComponent(typeName, addOptions);
        setSelection(component.id);
      }

      ReactGA.event({
        category: 'edit',
        action: 'add component',
        label: typeName,
      });

      onClose();
    },
    [addOptions, onClose, selection, setLocation, setSelection],
  );

  return libraries.map((library) => {
    const { components, name: libraryName, structure } = library;

    return structure
      .filter(
        ({ components: names }) =>
          !searchExp || names.some((name) => name.match(searchExp)),
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
          {names
            ?.filter((name) => !searchExp || name.match(searchExp))
            .map((name) => {
              let content = (
                <AddButton
                  key={name}
                  label={components[name].name}
                  onClick={() => onAdd(`${libraryName}.${name}`)}
                />
              );
              return content;
            })}
        </Box>
      ));
  });
};

export default AddLibraries;
