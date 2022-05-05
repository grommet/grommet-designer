import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Footer,
  Form,
  FormField,
  Header,
  Heading,
  Paragraph,
  RadioButtonGroup,
  Select,
  TextInput,
} from 'grommet';
import { Close } from 'grommet-icons';
import { pushPath } from './utils';
import { newDesign } from './design2';

const newPath = '/_new';

const NewDesign = ({ onClose, onLoadProps }) => {
  const [value, setValue] = useState({
    name: '',
    source: 'blank screen',
    theme: 'grommet',
    themeUrl: '',
  });
  const [designs, setDesigns] = useState([]);
  const nameRef = useRef();

  useEffect(() => {
    if (newPath !== window.location.pathname) pushPath(newPath);
    return () => pushPath('/');
  }, []);

  useEffect(() => {
    let stored = localStorage.getItem('designs');
    if (stored) setDesigns(JSON.parse(stored));
  }, []);

  useEffect(() => nameRef.current.focus(), []);

  return (
    <Box fill direction="row" justify="center">
      <Box
        pad="large"
        height={{ min: '100vh' }}
        width={{ max: 'large' }}
        gap="medium"
      >
        <Header>
          <Heading margin="none">new design</Heading>
          <Button
            tip="cancel creating a new design"
            icon={<Close />}
            onClick={onClose}
          />
        </Header>
        <Form
          validate="change"
          value={value}
          onChange={setValue}
          onSubmit={() => {
            const design = newDesign(value.name, value.themeUrl || value.theme);
            onLoadProps({ design, selection: 3 });
          }}
        >
          <FormField
            label="name"
            name="name"
            required
            validate={(name) =>
              designs.find((n) => n === name) ? 'existing' : undefined
            }
          >
            <TextInput ref={nameRef} name="name" />
          </FormField>
          <FormField label="start with">
            <RadioButtonGroup
              name="source"
              options={['blank screen', 'template', 'existing design']}
            />
          </FormField>
          {value.source === 'blank screen' && (
            <FormField label="theme" name="theme">
              <RadioButtonGroup
                name="theme"
                options={['grommet', 'hpe', 'other']}
              />
            </FormField>
          )}
          {value.source === 'existing design' && (
            <FormField label="duplicate design" name="duplicate">
              <Select name="duplicate" options={designs} />
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
          <Footer margin={{ top: 'medium' }}>
            <Button
              type="submit"
              primary
              disabled={value.source === 'template'}
              label={`${
                value.source === 'existing design' ? 'Duplicate' : 'Create'
              } Design`}
            />
          </Footer>
        </Form>
      </Box>
    </Box>
  );
};

export default NewDesign;
