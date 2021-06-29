import React from 'react';
import { Box, Heading } from 'grommet';
import AddButton from './AddButton';

const AddLibrary = ({
  components,
  name: libraryName,
  onAdd,
  searchExp,
  structure,
}) =>
  structure
    .filter(
      ({ components: names }) =>
        !searchExp || names.some((name) => name.match(searchExp)),
    )
    .map(({ name, Icon, components: names }) => (
      <Box flex={false}>
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
            .filter((name) => !searchExp || name.match(searchExp))
            .map((name) => {
              const typeName = `${libraryName}.${name}`;
              let content = (
                <AddButton
                  key={name}
                  label={components[name].name}
                  onClick={(event) =>
                    onAdd({
                      typeName,
                      containSelected: event.metaKey || event.ctrlKey,
                    })
                  }
                />
              );
              return content;
            })}
      </Box>
    ));

export default AddLibrary;
