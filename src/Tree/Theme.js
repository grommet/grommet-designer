import React, { Fragment } from 'react';
import {
  Box, FormField, Heading, Select, TextArea, TextInput,
} from 'grommet';
import themes from '../themes';
import Action from './Action';

const Theme = ({ design, onChange, onClose }) => (
  <Action onClose={onClose}>
    <Box flex={false}>
      <FormField label="Theme" name="theme">
        <Select
          options={[...Object.keys(themes), 'custom', 'undefined']}
          value={(design.theme
            && ((typeof design.theme === 'object' && 'custom') || design.theme))
            || ''
          }
          onChange={({ option }) => {
            const nextDesign = JSON.parse(JSON.stringify(design));
            if (option === 'custom') {
              nextDesign.theme = { global: { colors: {}, font: {} } };
            } else if (option === 'undefined') {
              delete nextDesign.theme;
            } else {
              nextDesign.theme = option;
            }
            onChange({ design: nextDesign });
          }}
        />
      </FormField>
      {design.theme && typeof design.theme === 'object' && (
        <Fragment>
          <Heading level={3} size="small">Font</Heading>
          <FormField
            label="family"
            name="family"
            help="Double quotes use Google fonts. Single quotes prompt for face."
          >
            <TextInput
              value={design.theme.global.font.family || ''}
              onChange={(event) => {
                const family = event.target.value;
                const nextDesign = JSON.parse(JSON.stringify(design));
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
                      const nextDesign = JSON.parse(JSON.stringify(design));
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
            <FormField label="face" name="face">
              <TextArea
                cols={40}
                rows={8}
                value={design.theme.global.font.face || ''}
                onChange={(event) => {
                  const face = event.target.value;
                  const nextDesign = JSON.parse(JSON.stringify(design));
                  nextDesign.theme.global.font.face = face;
                  onChange({ design: nextDesign });
                }}
              />
            </FormField>
          )}
          <Heading level={3} size="small">Colors</Heading>
          {['brand', 'accent-1', 'accent-2', 'accent-3', 'neutral-1', 'neutral-2', 'neutral-3'].map(color => (
            <FormField key={color} label={color} name={color}>
              <Box direction="row" align="center" gap="small">
                <TextInput
                  placeholder="#rrggbb"
                  plain
                  value={design.theme.global.colors[color] || ''}
                  onChange={(event) => {
                    const colorValue = event.target.value;
                    const nextDesign = JSON.parse(JSON.stringify(design));
                    nextDesign.theme.global.colors[color] = colorValue;
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
  </Action>
);

export default Theme;
