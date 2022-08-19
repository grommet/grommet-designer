import React, { forwardRef, useContext, useMemo } from 'react';
import { Box, Button, Text } from 'grommet';
import { Location } from 'grommet-icons';
import SelectionContext from '../SelectionContext';
import { useDesign } from '../design2';
import ArrayProperty from './ArrayProperty';

const ReferenceLabel = ({ selected, option }) => {
  return (
    <Box pad="small">
      <Text weight={selected ? 'bold' : undefined} truncate>
        {(option === 'undefined' && 'undefined') ||
          (option &&
            (option.name || option.text || `${option.type} ${option.id}`)) ||
          ''}
      </Text>
    </Box>
  );
};

const ReferenceProperty = forwardRef(({ name, onChange, value }, ref) => {
  const [, setSelection] = useContext(SelectionContext);
  const design = useDesign();
  const options = useMemo(
    () =>
      Object.values(design.components).filter(
        (c) => c.type !== 'designer.Reference' && c.name,
      ),
    [design],
  );

  return (
    <ArrayProperty
      ref={ref}
      name={name}
      Label={ReferenceLabel}
      options={options}
      value={value}
      valueKey={{ key: 'id', reduce: true }}
      searchTest={(option, searchExp) => searchExp.test(option.name)}
      onChange={onChange}
    >
      {value && (
        <Button
          icon={<Location />}
          tip="go to"
          hoverIndicator
          onClick={() => setSelection(value)}
        />
      )}
    </ArrayProperty>
  );
});

export default ReferenceProperty;
