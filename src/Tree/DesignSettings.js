import React, { useState } from 'react';
import {
  Anchor,
  Box,
  RadioButtonGroup,
  Select,
  Text,
  TextInput,
} from 'grommet';
import { setDesignProperty, setTheme, useDesign, useDesigns } from '../design2';
import useDebounce from '../useDebounce';
import Action from '../components/Action';
import Field from '../components/Field';

const DesignSettings = ({ onClose }) => {
  const designs = useDesigns();
  const design = useDesign();
  const [name, setName] = useDebounce(design.name || '', (nextName) =>
    setDesignProperty('name', nextName),
  );
  const [themeOther, setThemeOther] = useState(design.theme.startsWith('http'));

  return (
    <Action label="design" onClose={onClose}>
      <Box flex={false} gap="medium">
        <Field label="name" htmlFor="name">
          <TextInput
            id="name"
            name="name"
            plain
            value={name}
            onChange={(event) => setName(event.target.value)}
            style={{ textAlign: 'end' }}
          />
        </Field>
        {design.derivedFromId && (
          <Box
            align="end"
            margin={{ vertical: 'xsmall', horizontal: 'medium' }}
          >
            <Text size="small">
              derived from{' '}
              <Anchor
                size="small"
                label={design.derivedFromId}
                href={`//designer.grommet.io?${design.derivedFromId}`}
              />
            </Text>
          </Box>
        )}

        <Field label="theme" htmlFor="theme" align="center" gap="large">
          <RadioButtonGroup
            name="theme"
            direction="row"
            gap="medium"
            options={['grommet', 'hpe', 'other']}
            value={design.theme.startsWith('http') ? 'other' : design.theme}
            onChange={(event) => {
              if (event.target.value === 'other') {
                setTheme('https://theme-designer.grommet.io/');
                setThemeOther(true);
              } else {
                setTheme(event.target.value);
                setThemeOther(false);
              }
            }}
          />
        </Field>
        {themeOther && (
          <Field label="theme url" htmlFor="themeUrl">
            <TextInput
              id="themeUrl"
              name="themeUrl"
              plain
              value={design.theme}
              onChange={(event) => setTheme(event.target.value)}
              style={{ textAlign: 'end' }}
            />
          </Field>
        )}
        <Field label="includes" htmlFor="includes" name="includes">
          <Select
            name="includes"
            placeholder="none"
            multiple
            plain
            options={designs}
            value={design.includes || []}
            onChange={({ value }) => setDesignProperty('includes', value)}
          />
        </Field>
      </Box>
    </Action>
  );
};

export default DesignSettings;
