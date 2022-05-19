import React, { useContext, useMemo, useState } from 'react';
import { Anchor, Box, Heading } from 'grommet';
import { addComponent, duplicateComponent, useDesign } from '../design2';
import SelectionContext from '../SelectionContext';
import AddButton from './AddButton';
import AddMethod from './AddMethod';

const AddTemplates = ({ addOptions, onClose, searchExp }) => {
  const [, /* selection */ setSelection] = useContext(SelectionContext);
  const [addMode, setAddMode] = useState();

  const design = useDesign();
  const templates = useMemo(() => {
    const buildTemplates = (design) => {
      const templates = {};
      Object.values(design.components)
        .filter((component) => component.name) // must have a name
        .forEach((component) => {
          if (!templates[component.name]) templates[component.name] = component;
        });
      return { name: design.name, templates };
    };

    const result = [];
    result.push(buildTemplates(design));

    // imports
    //   .filter((i) => i.design)
    //   .forEach((i) => result.push({ ...i, ...buildTemplates(i.design) }));

    return result;
  }, [design]);

  return templates
    .filter((template) =>
      Object.keys(template.templates).some(
        (n) => !searchExp || n.match(searchExp),
      ),
    )
    .map((template) => {
      const { name, templates, url } = template;

      return (
        <Box flex={false} border="top">
          <Box
            pad={{ horizontal: 'small', vertical: 'xsmall' }}
            margin={{ top: 'small' }}
          >
            <Heading level="3" size="small" margin="none">
              {url ? (
                <Anchor
                  target="_blank"
                  href={`${url}&mode=edit`}
                  label={name}
                />
              ) : (
                name
              )}
            </Heading>
          </Box>
          {Object.keys(templates)
            .filter((name) => !searchExp || name.match(searchExp))
            .map((name) => (
              <AddButton
                key={name}
                label={name}
                onClick={(event) => {
                  const templateId = templates[name].id;
                  let component;
                  if (addMode === 'copy') {
                    component = duplicateComponent(templateId, addOptions);
                  } else if (addMode === 'reference') {
                    component = addComponent('designer.Reference', {
                      ...addOptions,
                      props: { component: templateId },
                    });
                  }
                  if (component) setSelection(component.id);
                  onClose();
                }}
              />
            ))}
          <Box pad="small">
            <AddMethod id={name} value={addMode} onChange={setAddMode} />
          </Box>
        </Box>
      );
    });
};

export default AddTemplates;
