import React, { useEffect, useRef, useState } from 'react';
import {
  // Box,
  Button,
  Footer,
  Form,
  FormField,
  // Header,
  // Heading,
  Page,
  PageContent,
  PageHeader,
  Paragraph,
  RadioButtonGroup,
  Select,
  TextInput,
} from 'grommet';
import { Close } from 'grommet-icons';
import { pushPath } from './utils';
import { newDesign } from './design2';
import app from './templates/app';

const templates = { app };

const newPath = '/_new';

const NewDesign = ({ onClose, onLoadProps }) => {
  const [value, setValue] = useState({
    name: '',
    source: 'blank',
    theme: 'grommet',
    themeUrl: '',
  });
  const [designs, setDesigns] = useState([]);
  const [sources, setSources] = useState(['blank', ...Object.keys(templates)]);
  const nameRef = useRef();

  useEffect(() => {
    if (newPath !== window.location.pathname) pushPath(newPath);
    return () => pushPath('/');
  }, []);

  useEffect(() => {
    let stored = localStorage.getItem('designs');
    if (stored) {
      const nextDesigns = JSON.parse(stored);
      setDesigns(nextDesigns);
      setSources((prev) => [...prev, ...nextDesigns]);
    }
  }, []);

  useEffect(() => nameRef.current.focus(), []);

  return (
    <Page kind="narrow">
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
            } else if (templates[value.source]) {
              const template = templates[value.source];
              loadProps.design = template;
              template.theme = value.themeUrl || value.theme;
              loadProps.location =
                template.screens[template.screenOrder[0]].path;
            } else {
              loadProps.design = newDesign(
                value.name,
                value.themeUrl || value.theme,
              );
              loadProps.selection = 1;
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
          <FormField label="start with">
            <Select name="source" options={sources} />
          </FormField>
          {(value.source === 'blank' || templates[value.source]) && (
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
          {value.source === 'template' && (
            <Paragraph>
              Alas, creating a new design from a template is still under
              construction.
            </Paragraph>
          )}
          <Footer margin={{ vertical: 'large' }}>
            <Button
              title="create design"
              type="submit"
              primary
              disabled={value.source === 'template'}
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
