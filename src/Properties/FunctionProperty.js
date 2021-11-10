import React, { useContext } from 'react';
import { Box, Button, Heading, Layer, Text } from 'grommet';
import { Close, FormDown } from 'grommet-icons';
import DesignContext from '../DesignContext';
import Field from '../components/Field';
import ComponentInput from './ComponentInput';

const jsonValue = (value) =>
  typeof value === 'string' ? value : JSON.stringify(value);

const FunctionProperty = React.forwardRef(
  ({ first, linkOptions, name, property, sub, theme, value, ...rest }, ref) => {
    // need 'component' for GridAreas
    const { design, selected } = useContext(DesignContext);
    const component = design.components[selected.component];
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
            ComponentInput={ComponentInput}
            component={component}
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
              <Button
                tip={{
                  content: 'close',
                  dropProps: { align: { right: 'left' } },
                }}
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
                  ComponentInput={ComponentInput}
                  component={component}
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
