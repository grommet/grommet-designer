import React from 'react';
import { Box, Button, Heading, Layer, Text } from 'grommet';
import { Close, FormDown } from 'grommet-icons';
import Field from '../components/Field';
import ActionButton from '../components/ActionButton';

const jsonValue = value =>
  typeof value === 'string' ? value : JSON.stringify(value);

const FunctionProperty = React.forwardRef(
  ({ first, linkOptions, name, property, sub, theme, value, ...rest }, ref) => {
    const [expand, setExpand] = React.useState();
    const CustomProperty = property;
    if (property.inline) {
      return (
        <Field
          key={name}
          sub={sub}
          ref={ref}
          first={first}
          label={name}
          htmlFor={name}
        >
          <CustomProperty
            name={name}
            value={value}
            theme={theme}
            linkOptions={linkOptions}
            dropTarget={ref && ref.current}
            {...rest}
          />
        </Field>
      );
    }
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
                <FormDown color="control" />
              </Box>
            </Box>
          </Field>
        </Button>
        {expand && (
          <Layer
            position="right"
            margin="medium"
            animation="fadeIn"
            onEsc={() => setExpand(false)}
            onClickOutside={() => setExpand(false)}
          >
            <Box
              direction="row"
              align="center"
              justify="between"
              gap="medium"
              pad="small"
              flex={false}
            >
              <Heading margin={{ left: 'small', vertical: 'none' }} level={3}>
                {name}
              </Heading>
              <ActionButton
                title="close"
                icon={<Close />}
                onClick={() => setExpand(false)}
              />
            </Box>
            <Box
              overflow="auto"
              pad={{ horizontal: 'medium', bottom: 'medium' }}
            >
              <Box flex={false}>
                <CustomProperty
                  name={name}
                  value={value}
                  theme={theme}
                  linkOptions={linkOptions}
                  {...rest}
                />
              </Box>
            </Box>
          </Layer>
        )}
      </Box>
    );
  },
);

export default FunctionProperty;
