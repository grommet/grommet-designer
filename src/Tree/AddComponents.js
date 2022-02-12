import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Box, Keyboard, TextInput } from 'grommet';
import AddLibrary from './AddLibrary';
import AddTemplate from './AddTemplate';

const AddComponents = ({ design, imports, libraries, onAdd }) => {
  const [search, setSearch] = useState('');

  const inputRef = useRef();

  const templates = useMemo(() => {
    const buildTemplates = (design) => {
      const templates = {};
      Object.keys(design.components)
        .map((id) => design.components[id])
        .filter((component) => component.name)
        .forEach((component) => {
          if (!templates[component.name]) {
            templates[component.name] = component;
          }
        });
      return { design, name: design.name, templates };
    };

    const result = [];
    result.push(buildTemplates(design));

    imports
      .filter((i) => i.design)
      .forEach((i) => result.push({ ...i, ...buildTemplates(i.design) }));

    return result;
  }, [design, imports]);

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

      {templates
        .filter(
          ({ templates }) =>
            !searchExp ||
            Object.keys(templates).some((name) => name.match(searchExp)),
        )
        .map((template) => (
          <AddTemplate
            key={template.name}
            onAdd={onAdd}
            searchExp={searchExp}
            {...template}
          />
        ))}
    </Box>
  );
};

export default AddComponents;
