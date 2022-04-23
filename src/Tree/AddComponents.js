import React, { useLayoutEffect, useRef, useState } from 'react';
import { Box, Keyboard, TextInput } from 'grommet';
import { getLibraries } from '../design2';
import AddLibrary from './AddLibrary';

const AddComponents = ({ onAdd }) => {
  const libraries = getLibraries();
  const [search, setSearch] = useState('');

  const inputRef = useRef();

  // Ensure we always keep focus on the search input, even after the user
  // selects a location.
  useLayoutEffect(() => inputRef.current?.focus());

  const searchExp = search ? new RegExp(search, 'i') : undefined;

  return (
    <Box flex={false} gap="medium" margin={{ bottom: 'medium' }}>
      <Box flex={false} pad="small">
        <Keyboard
          onEnter={
            searchExp
              ? (event) => {
                  // find first match
                  let typeName;
                  libraries.some(({ name, components }) => {
                    const first = Object.keys(components).filter((n) =>
                      n.match(searchExp),
                    )[0];
                    if (first) typeName = `${name}.${first}`;
                    return !!typeName;
                  });
                  if (typeName) {
                    onAdd({
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
            onChange={(event) => setSearch(event.target.value)}
          />
        </Keyboard>
      </Box>

      {libraries.map((library) => (
        <AddLibrary
          key={library.name}
          onAdd={onAdd}
          searchExp={searchExp}
          {...library}
        />
      ))}
    </Box>
  );
};

export default AddComponents;
