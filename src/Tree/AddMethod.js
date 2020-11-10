import React, { useRef } from 'react';
import { Box, Drop, RadioButtonGroup, Text } from 'grommet';
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

  const Option = ({ option, checked, hover }) => {
    const ref = useRef();
    const Icon = methodIcons[option];
    return (
      <Box
        ref={ref}
        pad="xsmall"
        background={hover && !checked ? { color: 'active' } : undefined}
      >
        <Icon color={checked ? 'selected-text' : 'border'} />
        {hover && (
          <Drop target={ref.current} align={{ top: 'bottom' }}>
            <Box
              margin="xsmall"
              animation={{ type: 'fadeIn', duration: 100 }}
              pad="xsmall"
            >
              <Text>{option}</Text>
            </Box>
          </Drop>
        )}
      </Box>
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
      {(option, { checked, hover }) => (
        <Option option={option} checked={checked} hover={hover} />
      )}
    </RadioButtonGroup>
  );
};

export default AddMethod;
