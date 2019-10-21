import React from 'react';
import { Box, FormField, Select } from 'grommet';
import { getDisplayName } from '../../design';

const isValid = component =>
  component.type !== 'Grommet' && component.type !== 'Reference';

export default ({ design, selected, value, onChange }) => {
  const [components, setComponents] = React.useState(
    Object.keys(design.components).filter(id => isValid(design.components[id])),
  );
  return (
    <Box>
      <FormField label="component">
        <Select
          options={components}
          onSearch={text => {
            const regexp = new RegExp(text, 'i');
            setComponents(
              Object.keys(design.components).filter(id => {
                const component = design.components[id];
                return (
                  isValid(component) &&
                  regexp.test(component.name || component.type)
                );
              }),
            );
          }}
          value={value || ''}
          onChange={({ option }) => onChange(option)}
          valueLabel={
            value ? (
              <Box pad="small">{getDisplayName(design, value)}</Box>
            ) : (
              undefined
            )
          }
        >
          {option => <Box pad="small">{getDisplayName(design, option)}</Box>}
        </Select>
      </FormField>
    </Box>
  );
};
