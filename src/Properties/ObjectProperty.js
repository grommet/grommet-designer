import React from 'react';
import { Box, Button, Text } from 'grommet';
import { FormDown, FormUp } from 'grommet-icons';
import Field from '../components/Field';

const jsonValue = value =>
  typeof value === 'string' ? value : JSON.stringify(value);

const ObjectProperty = React.forwardRef(
  ({ first, name, onChange, property, Property, sub, theme, value }, ref) => {
    const [expand, setExpand] = React.useState();
    return (
      <Box key={name}>
        <Button ref={ref} hoverIndicator onClick={() => setExpand(!expand)}>
          <Field sub={sub} label={name} first={first}>
            <Box direction="row" align="center" gap="small">
              {value && (
                <Text weight="bold" truncate>
                  {jsonValue(value)}
                </Text>
              )}
              <Box flex={false} pad="small">
                {expand ? (
                  <FormUp color="control" />
                ) : (
                  <FormDown color="control" />
                )}
              </Box>
            </Box>
          </Field>
        </Button>
        {expand && (
          <Box pad={{ left: 'small' }} border="bottom">
            {Object.keys(property).map(key => (
              <Property
                key={key}
                sub
                name={key}
                property={property[key]}
                theme={theme}
                value={(value || {})[key]}
                onChange={subValue => {
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
