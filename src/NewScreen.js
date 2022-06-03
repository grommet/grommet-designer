import React, { useContext, useMemo, useState } from 'react';
import { Box, Button, Footer, Form, FormField, Select, Text } from 'grommet';
import { duplicateComponent, useDesign } from './design2';
import SelectionContext from './SelectionContext';
import blankPage from './templates/blankPage';
import dashboard from './templates/dashboard';
import details from './templates/details';
import list from './templates/list';
import table from './templates/table';

const builtInTemplates = {
  'empty page': blankPage,
  dashboard,
  details,
  list,
  table,
};

const label = (option) => (
  <Box direction="row" justify="between" pad="small" gap="medium">
    <Text weight="bold">{option.name}</Text>
    <Text color="text-weak">{option.contextName}</Text>
  </Box>
);

const addTemplates = (include, name) =>
  Object.values(include.screens).map((s) => ({
    name: s.name,
    root: s.root,
    contextName: name || include.name,
    include,
  }));

const NewScreen = () => {
  const [selection, setSelection, { setLocation }] =
    useContext(SelectionContext);
  const design = useDesign();

  const templates = useMemo(() => {
    const result = [];
    if (design.includes) {
      design.includes.forEach(({ id, name }) => {
        let stored = localStorage.getItem(name);
        if (!stored) stored = localStorage.getItem(id);
        if (stored) {
          const include = JSON.parse(stored);
          result.push(...addTemplates(include));
        }
      });
    }
    Object.values(builtInTemplates).forEach((include) =>
      result.push(...addTemplates(include, 'generic')),
    );
    return result;
  }, [design.includes]);

  const [value, setValue] = useState({
    template: templates.find((t) => t.name === 'empty page'),
  });

  return (
    <Box fill direction="row" justify="center">
      <Box
        pad="large"
        height={{ min: '100vh' }}
        width={{ max: 'large', min: 'medium' }}
        gap="medium"
      >
        <Form
          value={value}
          onChange={setValue}
          onSubmit={() => {
            const { root, include } = value.template;
            const id = duplicateComponent(root, {
              within: selection,
              template: include,
            });
            setLocation({ screen: selection });
            setSelection(id);
          }}
        >
          <FormField label="screen template" htmlFor="template" name="template">
            <Select
              id="template"
              name="template"
              options={templates}
              valueKey="name"
              valueLabel={label}
            >
              {label}
            </Select>
          </FormField>
          <Footer margin={{ top: 'medium' }}>
            <Button
              title="Use selected screen template"
              type="submit"
              primary
              label="Use template"
            />
          </Footer>
        </Form>
      </Box>
    </Box>
  );
};

export default NewScreen;
