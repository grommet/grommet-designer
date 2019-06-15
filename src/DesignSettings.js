import React, { Fragment } from 'react';
import {
  Box, Button, FormField, Heading, Layer, Paragraph, Select, TextArea, TextInput,
} from 'grommet';
import { Add, Close, Trash } from 'grommet-icons';

export default ({ design, themes, onChange, onClose }) => (
  <Layer onEsc={onClose} onClickOutside={onClose}>
    <Box
      flex={false}
      direction="row"
      align="center"
      justify="between"
      gap="medium"
      pad="medium"
    >
      <Heading level={2} margin="none">
        Design
      </Heading>
      <Button icon={<Close />} hoverIndicator onClick={onClose} />
    </Box>
    <Box flex overflow="auto" pad="medium">
      <Box flex={false}>
        <FormField label="Name" name="name">
          <TextInput
            value={design.name || ''}
            onChange={(event) => {
              const nextDesign = JSON.parse(JSON.stringify(design));
              nextDesign.name = event.target.value;
              onChange({ design: nextDesign });
            }}
          />
        </FormField>
        <FormField label="Theme" name="theme">
          <Select
            options={[...themes, 'custom', 'undefined']}
            value={(design.theme
              && ((typeof design.theme === 'object' && 'custom') || design.theme))
              || ''}
            onChange={({ option }) => {
              const nextDesign = JSON.parse(JSON.stringify(design));
              if (option === 'undefined') {
                nextDesign.theme = undefined;
              } else if (option === 'custom') {
                nextDesign.theme = { global: { colors: {}, font: {} } };
              } else {
                nextDesign.theme = option;
              }
              onChange({ design: nextDesign });
            }}
          />
        </FormField>
        {typeof design.theme === 'object' && (
          <Fragment>
            <Heading level={3}>Custom Theme</Heading>
            <Heading level={4}>Font</Heading>
            <FormField
              label="family"
              name="family"
              help={`example: "Exo 2", arial, sans-serif`}
            >
              <TextInput
                value={design.theme.global.font.family || ''}
                onChange={(event) => {
                  const family = event.target.value;
                  let nextDesign = JSON.parse(JSON.stringify(design));
                  nextDesign.theme.global.font.family = family;
                  onChange({ design: nextDesign });
                  // see if we need a face for any of the fonts
                  const names = family.split(',').map(f => f.trim());
                  names.forEach(name => {
                    const match = name.match(/^"(.+)"/);
                    if (match) {
                      fetch(`https://fonts.googleapis.com/css?family=${encodeURIComponent(match[1])}`)
                      .then(response => response.text())
                      .then(face => {
                        nextDesign = JSON.parse(JSON.stringify(nextDesign));
                        nextDesign.theme.global.font.face = face;
                        onChange({ design: nextDesign });
                      })
                    }
                  })
                }}
              />
            </FormField>
            {design.theme.global.font.family
              && design.theme.global.font.family.match(/'/) && (
              <FormField
                label="face"
                name="face"
              >
                <TextArea
                  cols={40}
                  rows={8}
                  value={design.theme.global.font.face || ''}
                  onChange={(event) => {
                    let nextDesign = JSON.parse(JSON.stringify(design));
                    nextDesign.theme.global.font.face = event.target.value;
                    onChange({ design: nextDesign });
                  }}
                />
              </FormField>
            )}
            <Heading level={4}>Colors</Heading>
            {['brand', 'accent-1', 'accent-2', 'accent-3', 'neutral-1', 'neutral-2', 'neutral-3'].map(color => (
              <FormField key={color} label={color} name={color}>
                <Box direction="row" align="center" gap="small">
                  <TextInput
                    placeholder="#rrggbb"
                    plain
                    value={design.theme.global.colors[color] || ''}
                    onChange={(event) => {
                      const nextDesign = JSON.parse(JSON.stringify(design));
                      nextDesign.theme.global.colors[color] = event.target.value;
                      onChange({ design: nextDesign });
                    }}
                  />
                  <Box pad="small" background={color} />
                </Box>
              </FormField>
            ))}
          </Fragment>
        )}
        <Box direction="row" align="center" justify="between">
          <Heading level={3}>Data</Heading>
          <Button
            icon={<Add />}
            hoverIndicator
            onClick={() => {
              const nextDesign = JSON.parse(JSON.stringify(design));
              if (!nextDesign.data) {
                nextDesign.data = { data: '' };
              } else {
                nextDesign.data[`data-${Object.keys(nextDesign.data).length}`] = '';
              }
              onChange({ design: nextDesign });
            }}
          />
        </Box>
        {design.data && (
          <Box flex={false}>
            <Paragraph>
              Data sources can be used to provide consistent content across
              your design.
              These can be JSON or a URL to a REST+json API endpoint.
              Reference the data using curly braces to wrap a path notation
              within component text. For example: {`{<dataname>.<property>}`}.
            </Paragraph>
            {Object.keys(design.data).map((key) => (
              <Box key={key} direction="row" align="start">
                <Box>
                  <FormField label="Name" name="name">
                    <TextInput
                      value={key}
                      onChange={(event) => {
                        if (event.target.value !== key) {
                          const nextDesign = JSON.parse(JSON.stringify(design));
                          nextDesign.data[event.target.value] = nextDesign.data[key];
                          delete nextDesign.data[key];
                          onChange({ design: nextDesign });
                        }
                      }}
                    />
                  </FormField>
                  <FormField label="Source" name="source">
                    <TextArea
                      cols={40}
                      rows={2}
                      value={design.data[key]}
                      onChange={(event) => {
                        const nextDesign = JSON.parse(JSON.stringify(design));
                        nextDesign.data[key] = event.target.value;
                        onChange({ design: nextDesign });
                      }}
                    />
                  </FormField>
                </Box>
                <Button
                  icon={<Trash />}
                  hoverIndicator
                  onClick={() => {
                    const nextDesign = JSON.parse(JSON.stringify(design));
                    delete nextDesign.data[key];
                    if (Object.keys(nextDesign.data).length === 0) {
                      delete nextDesign.data;
                    }
                    onChange({ design: nextDesign });
                  }}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  </Layer>
);
