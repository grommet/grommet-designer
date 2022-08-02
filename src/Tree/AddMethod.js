import React from 'react';
import { Box, RadioButtonGroup, Tip } from 'grommet';
import { Copy, Link } from 'grommet-icons';

const methods = ['copy', 'reference'];

const methodIcons = {
  copy: Copy,
  reference: Link,
};

const AddMethod = ({ id, value, onChange }) => {
  React.useEffect(() => {
    if (!value) onChange(methods[0]);
  }, [value, onChange]);

  const Option = ({ option, checked }) => {
    const Icon = methodIcons[option];
    return (
      <Tip content={option}>
        <Box pad="xsmall">
          <Icon color={checked ? 'selected-text' : 'border'} />
        </Box>
      </Tip>
    );
  };

  return (
    <RadioButtonGroup
      id={id}
      name={`${id}-add-method`}
      options={methods}
      value={value || methods[0]}
      onChange={(event) => onChange(event.target.value)}
      direction="row"
    >
      {(option, { checked }) => <Option option={option} checked={checked} />}
    </RadioButtonGroup>
  );
};

export default AddMethod;
