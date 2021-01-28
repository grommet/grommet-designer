import React from 'react';
import { Box, Button } from 'grommet';
import { Add, Close, Edit } from 'grommet-icons';
import { deleteComponent, upgradeDesign } from '../design';

const ComponentInput = ({
  componentId,
  design,
  name,
  onChange,
  selected,
  setDesign,
  setSelected,
  value,
}) => (
  <Box direction="row">
    {value ? (
      <>
        <Button
          icon={<Edit />}
          onClick={() => {
            setSelected({
              ...selected,
              property: {
                source: componentId,
                name,
                component: value,
                onChange,
              },
              component: value,
            });
          }}
        />
        <Button
          icon={<Close />}
          onClick={() => {
            const nextDesign = JSON.parse(JSON.stringify(design));
            const nextSelected = { ...selected };
            onChange(undefined, nextDesign);
            deleteComponent(nextDesign, value, nextSelected);
            upgradeDesign(nextDesign); // clean up links
            setSelected(nextSelected);
            setDesign(nextDesign);
          }}
        />
      </>
    ) : (
      <Button
        icon={<Add />}
        onClick={() => {
          setSelected({
            ...selected,
            property: { source: componentId, name, component: value, onChange },
            component: value,
          });
        }}
      />
    )}
  </Box>
);

export default ComponentInput;
