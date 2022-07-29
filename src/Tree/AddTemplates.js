import React, { useContext, useMemo } from 'react';
import { Anchor, Box, Heading } from 'grommet';
import { duplicateComponent, useDesign } from '../design2';
import SelectionContext from '../SelectionContext';
import AddButton from './AddButton';

const AddTemplates = ({ addOptions, onClose, searchExp }) => {
  const [, setSelection] = useContext(SelectionContext);

  const design = useDesign();
  const templates = useMemo(() => {
    const buildTemplates = (design) => {
      const result = {};
      Object.values(design.components)
        .filter((component) => component.name) // must have a name
        .forEach((component) => {
          if (!result[component.name]) result[component.name] = component;
        });
      return { design, templates: result };
    };

    const result = [];
    result.push(buildTemplates(design));

    if (design.includes) {
      design.includes.forEach(({ id, name }) => {
        const stored = localStorage.getItem(id) || localStorage.getItem(name);
        if (stored) result.push(buildTemplates(JSON.parse(stored)));
      });
    }

    return result;
  }, [design]);

  return templates
    .filter((template) =>
      Object.keys(template.templates).some(
        (n) => !searchExp || n.match(searchExp),
      ),
    )
    .map((template) => {
      const { design, templates, url } = template;
      const { name } = design;

      return (
        <Box key={name} flex={false} border="top">
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
                  const id = duplicateComponent(templateId, {
                    ...addOptions,
                    template: design,
                  });
                  if (id) setSelection(id);
                  onClose();
                }}
              />
            ))}
        </Box>
      );
    });
};

export default AddTemplates;
