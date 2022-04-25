import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Box, Keyboard, TextInput } from 'grommet';
import { getLibraries, useDesign } from '../design2';
import AddLibraries from './AddLibraries';
import AddTemplates from './AddTemplates';

const AddComponents = ({ onAdd }) => {
  // const libraries = getLibraries();
  const [search, setSearch] = useState('');

  const inputRef = useRef();

  // const design = useDesign();
  // const templates = useMemo(() => {
  //   const buildTemplates = (design) => {
  //     const templates = {};
  //     Object.values(design.components)
  //       .filter((component) => component.name) // must have a name
  //       .forEach((component) => {
  //         if (!templates[component.name])
  //           templates[component.name] = component;
  //       });
  //     return { name: design.name, templates };
  //   };

  //   const result = [];
  //   result.push(buildTemplates(design));

  //   // imports
  //   //   .filter((i) => i.design)
  //   //   .forEach((i) => result.push({ ...i, ...buildTemplates(i.design) }));

  //   return result;
  // }, [design]);

  // Ensure we always keep focus on the search input, even after the user
  // selects a location.
  useLayoutEffect(() => inputRef.current?.focus());

  const searchExp = search ? new RegExp(search, 'i') : undefined;

  return (
    <Box flex={false} gap="medium" margin={{ bottom: 'medium' }}>
      <Box flex={false} pad="small">
        <Keyboard
        // onEnter={
        //   searchExp
        //     ? (event) => {
        //         // find first match
        //         let typeName;
        //         libraries.some(({ name, components }) => {
        //           const first = Object.keys(components).filter((n) =>
        //             n.match(searchExp),
        //           )[0];
        //           if (first) typeName = `${name}.${first}`;
        //           return !!typeName;
        //         });
        //         if (typeName) {
        //           onAdd({
        //             typeName,
        //             containSelected: event.metaKey || event.ctrlKey,
        //           });
        //         }
        //       }
        //     : undefined
        // }
        >
          <TextInput
            ref={inputRef}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </Keyboard>
      </Box>

      <AddLibraries searchExp={searchExp} />

      <AddTemplates searchExp={searchExp} />
    </Box>
  );
};

export default AddComponents;
