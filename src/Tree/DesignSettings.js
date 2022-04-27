import React, { useCallback, useState } from 'react';
import {
  Anchor,
  Box,
  Button,
  Heading,
  Paragraph,
  RadioButtonGroup,
  Text,
  TextArea,
  TextInput,
} from 'grommet';
import { Add, Trash } from 'grommet-icons';
import { getTheme, setDesignProperty, useDesign } from '../design2';
import useDebounce from '../useDebounce';
import Action from '../components/Action';
import Field from '../components/Field';
import themes from '../themes';

const themeSuggestions = themes.map(
  ({ label, name, designerUrl, packageName, jsUrl }) => {
    const value = jsUrl || designerUrl || packageName;
    return {
      label: (
        <Box pad={{ horizontal: 'small', vertical: 'xsmall' }} gap="xsmall">
          <Text weight="bold">{label || name}</Text>
          <Text>{value}</Text>
        </Box>
      ),
      value,
    };
  },
);

const DesignSettings = ({ onClose }) => {
  const design = useDesign();
  const theme = getTheme();
  const [name, setName] = useDebounce(design.name || '', (nextName) =>
    setDesignProperty('name', nextName),
  );

  return (
    <Action label="design" onClose={onClose}>
      <Box flex={false} gap="medium">
        <Field label="Name" htmlFor="name">
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

        <Box>
          <Box direction="row" justify="between" align="center">
            <Heading level={3} size="small">
              Theme
            </Heading>
            <Anchor
              href={design.theme || 'https://theme-designer.grommet.io'}
              target="_blank"
              rel="noopener noreferrer"
            >
              theme designer
            </Anchor>
          </Box>

          <Field label="url" htmlFor="theme" align="start">
            <TextInput
              id="theme"
              name="theme"
              plain
              value={design.theme || ''}
              suggestions={themeSuggestions}
              onChange={(event) =>
                setDesignProperty('theme', event.target.value)
              }
              onSelect={({ suggestion }) =>
                setDesignProperty('theme', suggestion.value)
              }
              style={{ textAlign: 'end' }}
            />
          </Field>

          {theme && typeof theme.global.colors.background === 'object' && (
            <Field label="mode" htmlFor="themeMode">
              <RadioButtonGroup
                id="themeMode"
                name="themeMode"
                direction="row"
                gap="medium"
                margin={{ right: 'small' }}
                options={['dark', 'light']}
                value={design.themeMode}
                onChange={(event) =>
                  setDesignProperty('themeMode', event.target.value)
                }
              />
            </Field>
          )}
        </Box>

        <Box>
          <Box direction="row" justify="between" align="center">
            <Heading level={3} size="small">
              Imports
            </Heading>
            <Button
              title="add an import"
              tip="add an import"
              icon={<Add />}
              hoverIndicator
              onClick={() => {
                const nextImports = (design.imports || []).slice(0);
                nextImports.push({});
                setDesignProperty('imports', nextImports);
              }}
            />
          </Box>
          {design.imports && (
            <Box flex={false}>
              {design.imports.map((impor, index) => (
                <Box
                  key={index}
                  direction="row"
                  align="start"
                  justify="between"
                >
                  <Box flex="grow">
                    <Field htmlFor={`url-${index}`}>
                      <TextInput
                        id={`url-${index}`}
                        name={`url-${index}`}
                        plain
                        placeholder="url"
                        value={impor.url}
                        onChange={(event) => {
                          const nextImports = design.imports.slice(0);
                          nextImports[index].url = event.target.value;
                          setDesignProperty('imports', nextImports);
                        }}
                        style={{ textAlign: 'end' }}
                      />
                    </Field>
                  </Box>
                  <Button
                    title="remove import"
                    tip="remove import"
                    icon={<Trash />}
                    hoverIndicator
                    onClick={() => {
                      const nextImports = design.imports.slice(0);
                      nextImports.splice(index, 1);
                      setDesignProperty('imports', nextImports);
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Action>
  );
};

export default DesignSettings;
