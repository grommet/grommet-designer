import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactGA from 'react-ga';
import {
  Button,
  Footer,
  Form,
  FormField,
  Page,
  PageContent,
  PageHeader,
  RadioButtonGroup,
  Select,
  TextInput,
} from 'grommet';
import { Close } from 'grommet-icons';
import { pushPath } from './utils';
import { newDesign, useDesigns } from './design2';
import app from './templates/app';

const builtInTemplates = { 'generic app': app };

const newPath = '/_new';

const startWithOptions = [
  'start with a blank design',
  'duplicate an existing design',
];

const NewDesign = ({ onClose, onLoadProps }) => {
  const [value, setValue] = useState({
    name: '',
    startWith: startWithOptions[0],
    theme: 'grommet',
    themeUrl: '',
  });
  const designs = useDesigns();
  const nameRef = useRef();

  useEffect(() => {
    if (newPath !== window.location.pathname) pushPath(newPath);
    return () => pushPath('/');
  }, []);

  const templates = useMemo(
    () => [...Object.keys(builtInTemplates), ...designs],
    [designs],
  );

  useEffect(() => nameRef.current.focus(), []);

  return (
    <Page kind="narrow" height={{ min: '100vh' }}>
      <PageContent>
        <PageHeader
          margin={{ vertical: 'large' }}
          title="new design"
          actions={
            <Button
              tip="cancel creating a new design"
              icon={<Close />}
              onClick={onClose}
            />
          }
        />
        <Form
          validate="change"
          value={value}
          onChange={setValue}
          onSubmit={() => {
            const loadProps = {};
            if (designs.includes(value.source)) {
              // loading an existing design, load what we've got
              // and change the name
              loadProps.design = JSON.parse(localStorage.getItem(value.source));
              ReactGA.event({ category: 'switch', action: 'duplicate design' });
            } else if (builtInTemplates[value.source]) {
              const template = builtInTemplates[value.source];
              loadProps.design = template;
              template.theme = value.themeUrl || value.theme;
              loadProps.location =
                template.screens[template.screenOrder[0]].path;
              ReactGA.event({ category: 'switch', action: 'template design' });
            } else {
              loadProps.design = newDesign(
                value.name,
                value.themeUrl || value.theme,
              );
              loadProps.selection = 1;
              loadProps.includes = value.includes;
              ReactGA.event({ category: 'switch', action: 'new design' });
            }
            loadProps.design.name = value.name;
            onLoadProps(loadProps);
          }}
        >
          <FormField
            label="name"
            htmlFor="name"
            name="name"
            required
            validate={(name) =>
              designs.find((n) => n === name) ? 'existing' : undefined
            }
          >
            <TextInput ref={nameRef} id="name" name="name" />
          </FormField>
          <RadioButtonGroup
            id="startWith"
            name="startWith"
            direction="row"
            gap="medium"
            pad={{ vertical: 'medium', horizontal: 'small' }}
            options={startWithOptions}
          />
          {value.startWith === startWithOptions[1] && (
            <FormField label="template" htmlFor="template" name="template">
              <Select name="template" options={templates} />
            </FormField>
          )}
          {(value.startWith === startWithOptions[0] ||
            builtInTemplates[value.template]) && (
            <FormField label="theme" name="theme">
              <RadioButtonGroup
                name="theme"
                direction="row"
                gap="medium"
                options={['grommet', 'hpe', 'other']}
              />
            </FormField>
          )}
          {value.theme === 'other' && (
            <FormField label="theme url" name="themeUrl">
              <TextInput
                name="themeUrl"
                placeholder="https://theme-designer.grommet-io/"
              />
            </FormField>
          )}
          {value.startWith === startWithOptions[0] && (
            <FormField
              label="include other designs to be able to copy their components"
              htmlFor="includes"
              name="includes"
            >
              <Select
                name="includes"
                placeholder="none"
                multiple
                options={designs}
              />
            </FormField>
          )}
          <Footer margin={{ vertical: 'large' }}>
            <Button
              title="create design"
              type="submit"
              primary
              label={`${
                value.source === 'existing design' ? 'Duplicate' : 'Create'
              } Design`}
            />
          </Footer>
        </Form>
      </PageContent>
    </Page>
  );
};

export default NewDesign;
