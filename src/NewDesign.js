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

const builtInTemplates = [app];

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
  const designs = useDesigns({ fetched: true });
  const nameRef = useRef();

  useEffect(() => {
    if (newPath !== window.location.pathname) pushPath(newPath);
    return () => pushPath('/');
  }, []);

  const templates = useMemo(() => [...builtInTemplates, ...designs], [designs]);

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
            if (value.startWith === startWithOptions[1]) {
              if (designs.includes(value.template)) {
                // loading an existing design, load what we've got
                // and change the name
                const design = JSON.parse(
                  localStorage.getItem(value.template.name) ||
                    localStorage.getItem(value.template.id),
                );
                loadProps.location = design.screens[design.screenOrder[0]].path;
                loadProps.design = design;
                ReactGA.event({
                  category: 'switch',
                  action: 'duplicate design',
                });
              } else if (builtInTemplates.includes(value.template)) {
                const design = JSON.parse(JSON.stringify(value.template));
                design.theme = value.themeUrl || value.theme;
                loadProps.location = design.screens[design.screenOrder[0]].path;
                loadProps.design = design;
                ReactGA.event({
                  category: 'switch',
                  action: 'template design',
                });
              }
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
              designs.find(({ name: n, local }) => local && n === name)
                ? 'existing'
                : undefined
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
            <FormField
              label="template"
              htmlFor="template"
              name="template"
              required
            >
              <Select name="template" options={templates} labelKey="name" />
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
                labelKey="name"
              />
            </FormField>
          )}
          <Footer margin={{ vertical: 'large' }}>
            <Button
              title={`${
                value.startWith === startWithOptions[1] ? 'duplicate' : 'create'
              } design`}
              type="submit"
              primary
              label={`${
                value.startWith === startWithOptions[1] ? 'Duplicate' : 'Create'
              } Design`}
            />
          </Footer>
        </Form>
      </PageContent>
    </Page>
  );
};

export default NewDesign;
