import React, { Fragment } from 'react';
import {
  Box, Button, FormField, Heading, Layer, Select, TextInput,
} from 'grommet';
import { Close } from 'grommet-icons';

export default ({ design, themes, onChange, onClose }) => (
  <Layer position="center" onEsc={onClose} onClickOutside={onClose}>
    <Box pad="medium">
      <Box
        flex={false}
        direction="row"
        align="center"
        justify="between"
        gap="medium"
      >
        <Heading level={2} margin="none">
          Design
        </Heading>
        <Button icon={<Close />} hoverIndicator onClick={onClose} />
      </Box>
      <Box flex overflow="auto">
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
              <Heading level={3}>Font</Heading>
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
              <Heading level={3}>Colors</Heading>
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
        </Box>
      </Box>
    </Box>
  </Layer>
);
