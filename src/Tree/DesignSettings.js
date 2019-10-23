import React from 'react';
import {
  Anchor,
  Box,
  CheckBox,
  Paragraph,
  Select,
  TextArea,
  TextInput,
} from 'grommet';
import { Add, Trash } from 'grommet-icons';
import Action from '../components/Action';
import ActionButton from '../components/ActionButton';
import Field from '../components/Field';
import themes from '../themes';

export default ({ design, onClose, setDesign }) => (
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

      <Field
        label="Theme"
        htmlFor="theme"
        help={
          <Anchor
            href="https://theme-designer.grommet.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            theme designer
          </Anchor>
        }
      >
        <Select
          id="theme"
          name="theme"
          plain
          options={['published', ...Object.keys(themes), 'custom']}
          value={
            (design.theme &&
              ((typeof design.theme === 'object' && 'custom') ||
                (design.theme.slice(0, 6) === 'https:' && 'published') ||
                design.theme)) ||
            'grommet'
          }
          onChange={({ option }) => {
            const nextDesign = JSON.parse(JSON.stringify(design));
            if (option === 'custom') {
              nextDesign.theme = { global: { colors: {}, font: {} } };
            } else if (option === 'published') {
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
        design.theme.slice(0, 6) === 'https:' && (
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
      {design.theme && typeof design.theme === 'object' && (
        <Box margin={{ left: 'medium' }} background="dark-2">
          <Field
            label="font.family"
            htmlFor="family"
            help="Double quotes use Google fonts. Single quotes prompt for face."
            align="start"
          >
            <TextInput
              id="family"
              name="family"
              plain
              placeholder="Arial, sans-serif"
              value={design.theme.global.font.family || ''}
              onChange={event => {
                const family = event.target.value;
                const nextDesign = JSON.parse(JSON.stringify(design));
                nextDesign.theme.global.font.family = family;
                setDesign(nextDesign);
                // see if we need a face for any of the fonts
                const names = family.split(',').map(f => f.trim());
                names.forEach(name => {
                  const match = name.match(/^"(.+)"/);
                  if (match) {
                    fetch(
                      `https://fonts.googleapis.com/css?family=${encodeURIComponent(
                        match[1],
                      )}`,
                    )
                      .then(response => response.text())
                      .then(face => {
                        const nextDesign2 = JSON.parse(
                          JSON.stringify(nextDesign),
                        );
                        nextDesign2.theme.global.font.face = face;
                        setDesign(nextDesign2);
                      });
                  }
                });
              }}
              style={{ textAlign: 'end' }}
            />
          </Field>
          {design.theme.global.font.family &&
            design.theme.global.font.family.match(/'/) && (
              <Field label="face" htmlFor="face" align="start">
                <TextArea
                  id="face"
                  name="face"
                  plain
                  cols={20}
                  rows={8}
                  value={design.theme.global.font.face || ''}
                  onChange={event => {
                    const face = event.target.value;
                    const nextDesign = JSON.parse(JSON.stringify(design));
                    nextDesign.theme.global.font.face = face;
                    setDesign(nextDesign);
                  }}
                />
              </Field>
            )}
          {[
            'brand',
            'accent-1',
            'accent-2',
            'accent-3',
            'neutral-1',
            'neutral-2',
            'neutral-3',
          ].map(color => (
            <Field key={color} label={`colors.${color}`} htmlFor={color}>
              <Box direction="row" align="center" gap="small">
                <TextInput
                  id={color}
                  name={color}
                  placeholder="#rrggbb"
                  plain
                  value={design.theme.global.colors[color] || ''}
                  onChange={event => {
                    const colorValue = event.target.value;
                    const nextDesign = JSON.parse(JSON.stringify(design));
                    nextDesign.theme.global.colors[color] = colorValue;
                    setDesign(nextDesign);
                  }}
                  style={{ textAlign: 'end' }}
                />
                <Box pad="small" background={color} />
              </Box>
            </Field>
          ))}
        </Box>
      )}

      <Field label="Library" htmlFor="library">
        <TextInput
          id="library"
          name="library"
          plain
          value={design.library || ''}
          onChange={event => {
            const nextDesign = JSON.parse(JSON.stringify(design));
            nextDesign.library = event.target.value;
            setDesign(nextDesign);
          }}
          style={{ textAlign: 'end' }}
        />
      </Field>

      <Field label="Data" htmlFor="data">
        <Box pad="small">
          <CheckBox
            id="data"
            name="data"
            toggle
            checked={design.data || false}
            onChange={event => {
              const nextDesign = JSON.parse(JSON.stringify(design));
              nextDesign.data = event.target.checked ? { data: '' } : undefined;
              setDesign(nextDesign);
            }}
          />
        </Box>
      </Field>
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
                    value={key}
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
          <Box alignSelf="start">
            <ActionButton
              title="add a data source"
              icon={<Add />}
              hoverIndicator
              onClick={() => {
                const nextDesign = JSON.parse(JSON.stringify(design));
                if (!nextDesign.data) {
                  nextDesign.data = { data: '' };
                } else {
                  nextDesign.data[
                    `data-${Object.keys(nextDesign.data).length}`
                  ] = '';
                }
                setDesign(nextDesign);
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  </Action>
);
