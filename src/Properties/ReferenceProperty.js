import React, { forwardRef, useContext } from 'react';
import { Box, Button, Text } from 'grommet';
import { Location } from 'grommet-icons';
import { getDisplayName, getScreenForComponent } from '../design';
import DesignContext from '../DesignContext';
import ArrayProperty from './ArrayProperty';

const ReferenceLabel = ({ selected, value }) => {
  const { design } = useContext(DesignContext);
  return (
    <Box pad="small">
      <Text weight={selected ? 'bold' : undefined}>
        {(value === 'undefined' && 'undefined') ||
          (value && getDisplayName(design, value)) ||
          ''}
      </Text>
    </Box>
  );
};

const ReferenceProperty = forwardRef(
  ({ first, name, onChange, sub, value }, ref) => {
    const { design, selected, setSelected } = useContext(DesignContext);
    const isReferenceable = (component) =>
      component.type !== 'Grommet' && component.type !== 'Reference';
    const options = Object.keys(design.components).filter((id) =>
      isReferenceable(design.components[id]),
    );
    let referenceSelected;
    if (value) {
      const component = parseInt(value, 10);
      if (component) {
        const screen = getScreenForComponent(design, component);
        if (screen) {
          referenceSelected = { ...selected, screen, component };
        }
      }
    }
    return (
      <ArrayProperty
        ref={ref}
        name={name}
        sub={sub}
        first={first}
        Label={ReferenceLabel}
        options={options}
        value={value}
        searchTest={(option, searchExp) =>
          searchExp.test(getDisplayName(design, option))
        }
        onChange={onChange}
      >
        {referenceSelected && (
          <Button
            icon={<Location />}
            hoverIndicator
            onClick={() => setSelected(referenceSelected)}
          />
        )}
      </ArrayProperty>
    );
  },
);

export default ReferenceProperty;
