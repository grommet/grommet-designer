import React from 'react';
import { Box, Button, Heading, Layer, Text } from 'grommet';
import { Close, FormDown } from 'grommet-icons';
// import DesignContext from '../DesignContext';
import Field from '../components/Field';
import ComponentInput from './ComponentInput';

const jsonValue = (value) =>
  typeof value === 'string' ? value : JSON.stringify(value);

const FunctionProperty = React.forwardRef(
  ({ definition, name, value, ...rest }, ref) => {
    // need 'design' for BoxGridArea
    // const { design, selected } = useContext(DesignContext);
    // need 'component' for BoxGridArea and GridAreas
    // const component = design.components[selected.component];
    const [expand, setExpand] = React.useState();
    const CustomProperty = definition;
    if (definition.inline) {
      return (
        <Field key={name} ref={ref} label={name} htmlFor={name}>
          <CustomProperty
            name={name}
            value={value}
            dropTarget={ref && ref.current}
            ComponentInput={ComponentInput}
            {...rest}
          />
        </Field>
      );
    }
    return (
      <Box key={name}>
        <Button ref={ref} hoverIndicator onClick={() => setExpand(!expand)}>
          <Field label={name}>
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
                  ComponentInput={ComponentInput}
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
