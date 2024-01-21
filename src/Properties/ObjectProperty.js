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
        <Box flex direction="row" gap="small">
          <Field flex label={name}>
            {value && (
              <Text weight="bold" truncate>
                {jsonValue(value)}
              </Text>
            )}
            <span style={{ display: 'flex' }}>
              <Button
                ref={ref}
                hoverIndicator
                onClick={() => setExpand(!expand)}
              >
                <Box pad={{ vertical: 'xsmall', horizontal: 'small' }}>
                  {expand ? (
                    <FormUp color="control" />
                  ) : (
                    <FormDown color="control" />
                  )}
                </Box>
              </Button>
              {value && (
                <Button
                  icon={<FormClose />}
                  tip={`clear ${name}`}
                  hoverIndicator
                  onClick={() => onChange(undefined)}
                  pad={{ vertical: 'xsmall', horizontal: 'small' }}
                />
              )}
            </span>
          </Field>
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
