import React from 'react';
import {
  Anchor,
  Box,
  Heading,
  Paragraph,
  RadioButtonGroup,
  Text,
  TextArea,
  TextInput,
} from 'grommet';
import { Add, Trash } from 'grommet-icons';
import Action from '../components/Action';
import ActionButton from '../components/ActionButton';
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

const DesignSettings = ({ design, onClose, setDesign, theme }) => {
  return (
    <Action label="design" onClose={onClose}>
      <Box flex={false} gap="medium">
        <Field label="Name" htmlFor="name">
          <TextInput
            id="name"
            name="name"
            plain
            value={design.name || ''}
            onChange={(event) => {
              const nextDesign = JSON.parse(JSON.stringify(design));
              nextDesign.name = event.target.value;
              setDesign(nextDesign);
            }}
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
            <ActionButton
              title="add an import"
              icon={<Add />}
              hoverIndicator
              onClick={() => {
                const nextDesign = JSON.parse(JSON.stringify(design));
                if (!nextDesign.imports) nextDesign.imports = [];
                nextDesign.imports.push({});
                setDesign(nextDesign);
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
                          const nextDesign = JSON.parse(JSON.stringify(design));
                          nextDesign.imports[index].url = event.target.value;
                          setDesign(nextDesign);
                        }}
                        style={{ textAlign: 'end' }}
                      />
                    </Field>
                  </Box>
                  <ActionButton
                    title="remove import"
                    icon={<Trash />}
                    hoverIndicator
                    onClick={() => {
                      const nextDesign = JSON.parse(JSON.stringify(design));
                      nextDesign.imports.splice(index, 1);
                      setDesign(nextDesign);
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
              onChange={(event) => {
                const themeValue = event.target.value;
                const nextDesign = JSON.parse(JSON.stringify(design));
                nextDesign.theme = themeValue;
                setDesign(nextDesign);
              }}
              onSelect={({ suggestion }) => {
                const nextDesign = JSON.parse(JSON.stringify(design));
                nextDesign.theme = suggestion.value;
                setDesign(nextDesign);
              }}
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
                onChange={(event) => {
                  const nextDesign = JSON.parse(JSON.stringify(design));
                  nextDesign.themeMode = event.target.value;
                  setDesign(nextDesign);
                }}
              />
            </Field>
          )}
        </Box>

        <Box>
          <Box direction="row" justify="between" align="center">
            <Heading level={3} size="small">
              Data
            </Heading>
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
                            const nextDesign = JSON.parse(
                              JSON.stringify(design),
                            );
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
                        onChange={(event) => {
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
      </Box>
    </Action>
  );
};

export default DesignSettings;
