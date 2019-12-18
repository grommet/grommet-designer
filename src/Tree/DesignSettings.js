import React from 'react';
import {
  Anchor,
  Box,
  Heading,
  Paragraph,
  RadioButtonGroup,
  Select,
  TextArea,
  TextInput,
} from 'grommet';
import { Add, Trash } from 'grommet-icons';
import Action from '../components/Action';
import ActionButton from '../components/ActionButton';
import Field from '../components/Field';
import themes from '../themes';

export default ({ design, onClose, setDesign, theme }) => (
  <Action label="design" onClose={onClose}>
    <Box flex={false}>
      <Field label="Name" htmlFor="name">
        <TextInput
          id="name"
          name="name"
          plain
          value={design.name || ''}
          onChange={event => {
            const nextDesign = JSON.parse(JSON.stringify(design));
            nextDesign.name = event.target.value;
            setDesign(nextDesign);
          }}
          style={{ textAlign: 'end' }}
        />
      </Field>

      <Field label="Based on" htmlFor="base">
        <TextInput
          id="base"
          name="base"
          plain
          placeholder="https://designer.grommet.io?id="
          value={design.base || ''}
          onChange={event => {
            const base = event.target.value;
            const nextDesign = JSON.parse(JSON.stringify(design));
            nextDesign.base = base;
            setDesign(nextDesign);
          }}
          style={{ textAlign: 'end' }}
        />
      </Field>

      <Box direction="row" justify="between" align="center">
        <Heading level={3}>Libraries</Heading>
        <ActionButton
          title="add a library"
          icon={<Add />}
          hoverIndicator
          onClick={() => {
            const nextDesign = JSON.parse(JSON.stringify(design));
            if (!nextDesign.library) {
              nextDesign.library = { '': '' };
            } else {
              nextDesign.library[''] = '';
            }
            setDesign(nextDesign);
          }}
        />
      </Box>
      {design.library && (
        <Box flex={false}>
          {Object.keys(design.library).map((key, index) => (
            <Box key={key} direction="row" align="start" justify="between">
              <Box flex="grow">
                <Field label="Name" htmlFor={`name-${index}`}>
                  <TextInput
                    id={`name-${index}`}
                    name={`name-${index}`}
                    plain
                    value={key || ''}
                    onChange={event => {
                      if (event.target.value !== key) {
                        const nextDesign = JSON.parse(JSON.stringify(design));
                        nextDesign.library[event.target.value] =
                          nextDesign.library[key];
                        delete nextDesign.library[key];
                        setDesign(nextDesign);
                      }
                    }}
                    style={{ textAlign: 'end' }}
                  />
                </Field>
                <Field label="URL" htmlFor={`url-${index}`}>
                  <TextInput
                    id={`url-${index}`}
                    name={`url-${index}`}
                    plain
                    value={design.library[key]}
                    onChange={event => {
                      const nextDesign = JSON.parse(JSON.stringify(design));
                      nextDesign.library[key] = event.target.value;
                      setDesign(nextDesign);
                    }}
                    style={{ textAlign: 'end' }}
                  />
                </Field>
              </Box>
              <ActionButton
                title="delete library"
                icon={<Trash />}
                hoverIndicator
                onClick={() => {
                  const nextDesign = JSON.parse(JSON.stringify(design));
                  delete nextDesign.library[key];
                  if (Object.keys(nextDesign.library).length === 0) {
                    delete nextDesign.library;
                  }
                  setDesign(nextDesign);
                }}
              />
            </Box>
          ))}
        </Box>
      )}

      <Box direction="row" justify="between" align="center">
        <Heading level={3}>Theme</Heading>
        <Anchor
          href="https://theme-designer.grommet.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          theme designer
        </Anchor>
      </Box>

      <Field label="Theme" htmlFor="theme">
        <Select
          id="theme"
          name="theme"
          plain
          options={['published', ...Object.keys(themes)]}
          value={
            (design.theme &&
              ((typeof design.theme === 'object' && 'custom') ||
                (design.theme.slice(0, 4) === 'http' && 'published') ||
                design.theme)) ||
            'grommet'
          }
          onChange={({ option }) => {
            const nextDesign = JSON.parse(JSON.stringify(design));
            if (option === 'published') {
              nextDesign.theme = 'https://';
            } else {
              nextDesign.theme = option;
            }
            setDesign(nextDesign);
          }}
          style={{ textAlign: 'end' }}
        />
      </Field>

      {design.theme &&
        typeof design.theme === 'string' &&
        design.theme.slice(0, 4) === 'http' && (
          <Field label="Theme url" htmlFor="themeUrl" align="start">
            <TextInput
              id="themeUrl"
              name="themeUrl"
              plain
              value={design.theme || ''}
              onChange={event => {
                const themeUrl = event.target.value;
                const nextDesign = JSON.parse(JSON.stringify(design));
                nextDesign.theme = themeUrl;
                setDesign(nextDesign);
              }}
              style={{ textAlign: 'end' }}
            />
          </Field>
        )}

      {theme && typeof theme.global.colors.background === 'object' && (
        <Field label="Theme mode" htmlFor="themeMode">
          <RadioButtonGroup
            id="themeMode"
            name="themeMode"
            direction="row"
            gap="medium"
            options={['dark', 'light']}
            value={design.themeMode}
            onChange={event => {
              const nextDesign = JSON.parse(JSON.stringify(design));
              nextDesign.themeMode = event.target.value;
              setDesign(nextDesign);
            }}
          />
        </Field>
      )}

      <Box direction="row" justify="between" align="center">
        <Heading level={3}>Data</Heading>
        <ActionButton
          title="add a data source"
          icon={<Add />}
          hoverIndicator
          onClick={() => {
            const nextDesign = JSON.parse(JSON.stringify(design));
            if (!nextDesign.data) {
              nextDesign.data = { data: '' };
            } else {
              nextDesign.data[`data-${Object.keys(nextDesign.data).length}`] =
                '';
            }
            setDesign(nextDesign);
          }}
        />
      </Box>
      {design.data && (
        <Box flex={false}>
          <Paragraph margin={{ horizontal: 'medium' }}>
            Data sources can be used to provide consistent content across your
            design. These can be JSON or a URL to a REST+json API endpoint.
            Reference the data using curly braces to wrap a path notation within
            component text. For example: {`{<dataname>.<property>}`}.
          </Paragraph>
          {Object.keys(design.data).map((key, index) => (
            <Box key={key} direction="row" align="start">
              <Box>
                <Field label="Name" htmlFor={`name-${index}`}>
                  <TextInput
                    id={`name-${index}`}
                    name={`name-${index}`}
                    plain
                    value={key || ''}
                    onChange={event => {
                      if (event.target.value !== key) {
                        const nextDesign = JSON.parse(JSON.stringify(design));
                        nextDesign.data[event.target.value] =
                          nextDesign.data[key];
                        delete nextDesign.data[key];
                        setDesign(nextDesign);
                      }
                    }}
                    style={{ textAlign: 'end' }}
                  />
                </Field>
                <Field label="Source" htmlFor={`source-${index}`}>
                  <TextArea
                    id={`source-${index}`}
                    name={`source-${index}`}
                    plain
                    cols={30}
                    rows={4}
                    value={design.data[key]}
                    onChange={event => {
                      const nextDesign = JSON.parse(JSON.stringify(design));
                      nextDesign.data[key] = event.target.value;
                      setDesign(nextDesign);
                    }}
                    style={{ textAlign: 'end' }}
                  />
                </Field>
              </Box>
              <ActionButton
                title="delete data source"
                icon={<Trash />}
                hoverIndicator
                onClick={() => {
                  const nextDesign = JSON.parse(JSON.stringify(design));
                  delete nextDesign.data[key];
                  if (Object.keys(nextDesign.data).length === 0) {
                    delete nextDesign.data;
                  }
                  setDesign(nextDesign);
                }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  </Action>
);
