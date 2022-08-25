import React from 'react';
import { Box, FormField, Paragraph, Select } from 'grommet';
import { getComponent, getParent } from '../../design2';

const BoxGridArea = ({ value, onChange, design, component }) => {
  let message;
  const parentId = getParent(component.id);
  let areas;
  if (!parentId) {
    message = `
      Well, gridArea only does anything when the parent component is a Grid.
      Currently, this Box has no parent.
    `;
  } else {
    const parent = getComponent(parentId);
    areas = parent.props.areas && parent.props.areas.map((a) => a.name);
    if (parent.type !== 'grommet.Grid') {
      message = `
        Well, gridArea only does anything when the parent component is a Grid.
        Currently, the parent of this component is a ${parent.type}
      `;
    } else if (!areas) {
      message = `
        Alas, no areas have been defined in the parent component.
        You will have to define some there first in order to set a gridArea.
      `;
    } else {
      areas.push('undefined');
    }
  }
  return (
    <Box>
      {message ? (
        <Paragraph>{message}</Paragraph>
      ) : (
        <FormField label="gridArea">
          <Select
            value={value ? value : ''}
            options={areas}
            onChange={({ option }) => {
              onChange(option === 'undefined' ? undefined : option);
            }}
          />
        </FormField>
      )}
    </Box>
  );
};

export default BoxGridArea;
