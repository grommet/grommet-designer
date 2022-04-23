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
              Data
            </Heading>
            <Button
              title="add a data source"
              tip="add a data source"
              icon={<Add />}
              hoverIndicator
              onClick={() => {
                let nextData;
                if (!design.data) {
                  nextData = { data: '' };
                } else {
                  nextData = { ...design.data };
                  nextData[`data-${Object.keys(nextData).length}`] = '';
                }
                setDesignProperty('data', nextData);
              }}
            />
          </Box>
          {design.data && (
            <Box flex={false}>
              <Paragraph margin={{ horizontal: 'medium' }}>
                Data sources can be used to provide consistent content across
                your design. These can be JSON or a URL to a REST+json API
                endpoint. Reference the data using curly braces to wrap a path
                notation within component text. For example:{' '}
                {`{<dataname>.<property>}`}.
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
                        onChange={(event) => {
                          if (event.target.value !== key) {
                            const nextData = { ...design.data };
                            nextData[event.target.value] = nextData[key];
                            delete nextData[key];
                            setDesignProperty('data', nextData);
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
                        onChange={(event) => {
                          const nextData = { ...design.data };
                          nextData[key] = event.target.value;
                          setDesignProperty('data', nextData);
                        }}
                        style={{ textAlign: 'end' }}
                      />
                    </Field>
                  </Box>
                  <Button
                    title="delete data source"
                    tip="delete data source"
                    icon={<Trash />}
                    hoverIndicator
                    onClick={() => {
                      const nextData = { ...design.data };
                      delete nextData[key];
                      setDesignProperty('data', nextData);
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
