import React from 'react';
import { Box, Button, CheckBox, Text, TextInput } from 'grommet';
import { FormClose } from 'grommet-icons';
import Field from '../components/Field';
import useDebounce from '../useDebounce';

const StringOrBooleanProperty = React.forwardRef(
  ({ name, onChange, value: valueProp, ...rest }, ref) => {
    const [value, setValue] = useDebounce(valueProp, onChange);
    return (
      <Field key={name} label={name} htmlFor={name}>
        <Box direction="row" gap="small">
          {value === undefined && (
            <Button title="set data reference" onClick={() => onChange('{}')}>
              <Text color="text-weak">{'{}'}</Text>
            </Button>
          )}
          {typeof value === 'string' ? (
            <>
              <TextInput
                ref={ref}
                id={name}
                name={name}
                plain
                value={value || ''}
                onChange={(event) => setValue(event.target.value)}
                style={{ textAlign: 'end' }}
              />
              <Button
                title="clear"
                icon={<FormClose />}
                hoverIndicator
                onClick={() => onChange(undefined)}
              />
            </>
          ) : (
            <Box direction="row" pad="small">
              <CheckBox
                ref={ref}
                id={name}
                name={name}
                checked={!!value}
                onChange={(event) => onChange(event.target.checked)}
              />
              {value === false && (
                <Box
                  title="undefine"
                  pad="xsmall"
                  round="xsmall"
                  hoverIndicator
                  onClick={() => onChange(undefined)}
                >
                  <FormClose />
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Field>
    );
  },
);

export default StringOrBooleanProperty;
