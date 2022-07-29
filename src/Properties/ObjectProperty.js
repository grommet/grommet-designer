import React from 'react';
import { Box, Button, Text } from 'grommet';
import { FormClose, FormDown, FormUp } from 'grommet-icons';
import Field from '../components/Field';

const jsonValue = (value) =>
  typeof value === 'string' ? value : JSON.stringify(value);

const ObjectProperty = React.forwardRef(
  ({ name, onChange, definition, Property, value }, ref) => {
    const [expand, setExpand] = React.useState();
    return (
      <Box key={name}>
        <Box direction="row">
          <Box flex>
            <Button ref={ref} hoverIndicator onClick={() => setExpand(!expand)}>
              <Field label={name}>
                <Box direction="row" align="center" gap="small">
                  {value && (
                    <Text weight="bold" truncate>
                      {jsonValue(value)}
                    </Text>
                  )}
                  <Box
                    flex={false}
                    pad={{ vertical: 'xsmall', horizontal: 'small' }}
                  >
                    {expand ? (
                      <FormUp color="control" />
                    ) : (
                      <FormDown color="control" />
                    )}
                  </Box>
                </Box>
              </Field>
            </Button>
          </Box>
          {value && (
            <Box border={{ side: 'horizontal' }}>
              <Button
                icon={<FormClose />}
                tip={`clear ${name}`}
                hoverIndicator
                onClick={() => onChange(undefined)}
              />
            </Box>
          )}
        </Box>
        {expand && (
          <Box pad={{ left: 'small' }} border="bottom">
            {Object.keys(definition).map((key) => (
              <Property
                key={key}
                name={key}
                definition={definition[key]}
                value={(value || {})[key]}
                onChange={(subValue) => {
                  let nextValue = { ...(value || {}) };
                  if (subValue !== undefined && subValue !== '')
                    nextValue[key] = subValue;
                  else delete nextValue[key];
                  onChange(
                    Object.keys(nextValue).length > 0 ? nextValue : undefined,
                  );
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    );
  },
);

export default ObjectProperty;
