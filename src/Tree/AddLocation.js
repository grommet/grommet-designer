import React from 'react';
import { Box, Drop, RadioButtonGroup, Text } from 'grommet';
import { Blank } from 'grommet-icons';
import { getParent } from '../design';
import { displayName, getComponentType } from '../utils';

const allLocations = ['within', 'after', 'before', 'container of'];

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
  'container of': [
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

export default ({ design, libraries, onChange, selected }) => {
  const selectedComponent = design.components[selected.component];
  const selectedType = React.useMemo(
    () =>
      selectedComponent
        ? getComponentType(libraries, selectedComponent.type)
        : undefined,
    [libraries, selectedComponent],
  );
  const selectedName = React.useMemo(() => displayName(selectedComponent), [
    selectedComponent,
  ]);

  const locations = React.useMemo(() => {
    const parent = getParent(design, selected.component);
    if (!parent)
      return allLocations.filter(l => l === 'within' || l === 'container of');
    if (selectedType && selectedType.container) return allLocations;
    return allLocations.filter(l => l !== 'within');
  }, [design, selected.component, selectedType]);

  const [location, setLocation] = React.useState();
  React.useEffect(() => setLocation(locations[0]), [locations]);
  React.useEffect(() => onChange(location), [location, onChange]);

  return (
    <RadioButtonGroup
      name="add-location"
      options={locations}
      disabled={locations.length === 1}
      value={location}
      onChange={event => setLocation(event.value)}
      direction="row"
    >
      {(option, { checked, hover }) => {
        const ref = React.useRef();
        return (
          <Box
            ref={ref}
            pad="xsmall"
            background={hover && !checked ? { color: 'active' } : undefined}
          >
            <Blank color={checked ? 'selected-text' : 'border'}>
              <g>{locationVisuals[option]}</g>
            </Blank>
            {hover && (
              <Drop target={ref.current} align={{ top: 'bottom' }}>
                <Box
                  margin="xsmall"
                  animation={{ type: 'fadeIn', duration: 100 }}
                  pad="xsmall"
                >
                  <Text>
                    {option} {selectedName}
                  </Text>
                </Box>
              </Drop>
            )}
          </Box>
        );
      }}
    </RadioButtonGroup>
  );
};
