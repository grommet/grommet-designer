import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  CheckBox,
  Footer,
  Form,
  FormField,
  Header,
  Heading,
  Layer,
  Select,
  Text,
} from 'grommet';
import { Close } from 'grommet-icons';
import { replace, getComponent, getDesign, getName } from '../design2';

const Replace = ({ targetId, onDone }) => {
  const design = getDesign();
  const { type } = getComponent(targetId);

  // other components having the same type, in this design and any includes
  const allOptions = useMemo(() => {
    const sameType = (components, template) =>
      Object.keys(components)
        .map((id) => parseInt(id, 10))
        .filter((id) => id !== targetId && components[id].type === type)
        .map((id) => ({ id, name: getName(id, { template }), template }));

    const result = [];
    result.push(...sameType(design.components));

    if (design.includes) {
      design.includes.forEach((name) => {
        const stored = localStorage.getItem(name);
        if (stored) {
          const include = JSON.parse(stored);
          result.push(...sameType(include.components, include));
        }
      });
    }

    return result;
  }, [design, targetId, type]);
  const [options, setOptions] = useState(allOptions);

  const OptionLabel = ({ option: { id, template }, selected }) => (
    <Box pad="small">
      <Text weight={selected ? 'bold' : undefined}>
        {getName(id, { template })}
      </Text>
    </Box>
  );

  return (
    <Layer
      position="top-right"
      margin="medium"
      animation="fadeIn"
      onClickOutside={onDone}
      onEsc={onDone}
    >
      <Box flex elevation="medium" pad="medium" gap="medium">
        <Header>
          <Heading level={2} size="small" margin="none">
            copy properties from
          </Heading>
          <Button icon={<Close />} onClick={onDone} />
        </Header>
        <Form
          onSubmit={({
            value: {
              template: { id, template },
              includeChildren,
            },
          }) => {
            replace(id, targetId, { includeChildren, template });
            onDone();
          }}
        >
          <FormField
            label="template"
            htmlFor="template"
            name="template"
            required
          >
            <Select
              id="template"
              name="template"
              options={options}
              placeholder="component ..."
              valueLabel={(option) => <OptionLabel option={option} selected />}
              onSearch={
                options.length > 10
                  ? (text) => {
                      const exp = new RegExp(`${text}`, 'i');
                      setOptions(
                        allOptions.filter(({ id, template }) =>
                          exp.test(getName(id, { template })),
                        ),
                      );
                    }
                  : undefined
              }
            >
              {(option, i, o, { selected }) => (
                <OptionLabel option={option} selected={selected} />
              )}
            </Select>
          </FormField>
          <FormField htmlFor="includeChildren" name="includeChildren">
            <CheckBox
              id="includeChildren"
              name="includeChildren"
              label="include children?"
            />
          </FormField>
          <Footer margin={{ top: 'medium' }}>
            <Button label="copy" type="submit" primary />
          </Footer>
        </Form>
      </Box>
    </Layer>
  );
};

export default Replace;
