import React, { useContext, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Form,
  Header,
  Heading,
  Layer,
  Select,
  Text,
} from 'grommet';
import { Close } from 'grommet-icons';
import DesignContext from '../DesignContext';
import { getDisplayName } from '../design';

const CopyPropertiesFrom = ({ component, onDone }) => {
  const { changeDesign, design } = useContext(DesignContext);
  const [value, setValue] = useState();
  const allOptions = useMemo(
    () =>
      Object.keys(design.components)
        .map((i) => parseInt(i, 10))
        .filter(
          (id) =>
            id !== component.id &&
            design.components[id].type === component.type,
        ),
    [component, design],
  );
  const [options, setOptions] = useState(allOptions);

  const OptionLabel = ({ option, selected }) => (
    <Box pad="small">
      <Text weight={selected ? 'bold' : undefined}>
        {getDisplayName(design, option)}
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
      <Header>
        <Heading
          level={2}
          size="small"
          margin={{ vertical: 'none', horizontal: 'medium' }}
        >
          copy properties from
        </Heading>
        <Button icon={<Close />} onClick={onDone} />
      </Header>
      <Form
        onSubmit={() => {
          if (value) {
            const nextDesign = JSON.parse(JSON.stringify(design));
            const nextComponent = nextDesign.components[component.id];
            const fromComponent = nextDesign.components[value];
            nextComponent.props = { ...fromComponent.props };
            changeDesign(nextDesign);
          }
          onDone();
        }}
      >
        <Box pad="medium" gap="small">
          <Select
            options={options}
            placeholder="component ..."
            value={value}
            valueLabel={value ? <OptionLabel option={value} selected /> : ''}
            onSearch={(text) => {
              const exp = new RegExp(`${text}`, 'i');
              setOptions(
                allOptions.filter((option) =>
                  exp.test(getDisplayName(design, option)),
                ),
              );
            }}
            onChange={({ value }) => setValue(value)}
          >
            {(option, i, o, { selected }) => (
              <OptionLabel option={option} selected={selected} />
            )}
          </Select>
          <Box>
            <Button label="copy" type="submit" primary />
          </Box>
        </Box>
      </Form>
    </Layer>
  );
};

export default CopyPropertiesFrom;
