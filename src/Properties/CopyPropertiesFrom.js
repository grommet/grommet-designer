import React, { useMemo, useState } from 'react';
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
import { copyProperties, getComponent, getDesign, getName } from '../design2';

const CopyPropertiesFrom = ({ targetId, onDone }) => {
  const design = getDesign();
  const [value, setValue] = useState();
  const { type } = getComponent(targetId);
  // other component ids having the same type
  const allOptions = useMemo(
    () =>
      Object.keys(design.components)
        .map((i) => parseInt(i, 10))
        .filter((id) => id !== targetId && design.components[id].type === type),
    [design, targetId, type],
  );
  const [options, setOptions] = useState(allOptions);

  const OptionLabel = ({ option, selected }) => (
    <Box pad="small">
      <Text weight={selected ? 'bold' : undefined}>{getName(option)}</Text>
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
          if (value) copyProperties(value, targetId);
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
                allOptions.filter((option) => exp.test(getName(option))),
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
