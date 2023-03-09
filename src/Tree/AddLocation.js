import React, { useContext, useEffect, useMemo } from 'react';
import { Box, RadioButtonGroup, Tip } from 'grommet';
import { Blank } from 'grommet-icons';
import SelectionContext from '../SelectionContext';
import { getName, getParent, getType, useComponent } from '../design2';

const locationVisuals = {
  after: [
    <rect
      key="top"
      x={0}
      y={0}
      width={24}
      height={1}
      strokeWidth={1}
      stroke="#666"
    />,
    <rect
      key="bottom"
      x={4}
      y={20}
      width={16}
      height={1}
      strokeWidth={8}
      stroke="#000"
    />,
  ],
  before: [
    <rect
      key="top"
      x={4}
      y={4}
      width={16}
      height={1}
      strokeWidth={8}
      stroke="#000"
    />,
    <rect
      key="bottom"
      x={0}
      y={24}
      width={24}
      height={1}
      strokeWidth={1}
      stroke="#666"
    />,
  ],
  containing: [
    <rect
      key="out"
      x={2}
      y={2}
      width={20}
      height={20}
      strokeWidth={4}
      stroke="#000"
    />,
    <rect
      key="in"
      x={8}
      y={8}
      width={8}
      height={8}
      strokeWidth={1}
      stroke="#666"
    />,
  ],
  within: [
    <rect
      key="out"
      x={0}
      y={0}
      width={24}
      height={24}
      strokeWidth={1}
      stroke="#000"
    />,
    <rect key="in" x={6} y={6} width={12} height={12} fill="#000" />,
  ],
};

const AddLocation = ({ value, onChange }) => {
  const [selection] = useContext(SelectionContext);
  const component = useComponent(selection);
  const type = useMemo(() => getType(component.type), [component]);

  const locations = useMemo(() => {
    const parent = getParent(selection);
    if (!parent) return ['within', 'containing'];
    if (type?.container) return ['within', 'after', 'before', 'containing'];
    return ['after', 'before', 'containing'];
  }, [selection, type]);

  useEffect(
    () => onChange(locations[type?.container === 'rarely' ? 1 : 0]),
    [locations, onChange, type],
  );

  const Option = ({ option, checked }) => {
    return (
      <Tip content={`${option} ${getName(selection)}`}>
        <Box pad="xsmall">
          <Blank color={checked ? 'selected-background' : 'border'}>
            <g>{locationVisuals[option]}</g>
          </Blank>
        </Box>
      </Tip>
    );
  };

  return (
    <RadioButtonGroup
      name="add-location"
      options={locations}
      disabled={locations.length === 1}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      direction="row"
    >
      {(option, { checked }) => <Option option={option} checked={checked} />}
    </RadioButtonGroup>
  );
};

export default AddLocation;
