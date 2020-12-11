import React from 'react';
import { Box, Button } from 'grommet';
import { Add, Close, Edit } from 'grommet-icons';

const ComponentInput = ({
  componentId,
  name,
  onChange,
  selected,
  setSelected,
  value,
}) => (
  <Box direction="row">
    {value ? (
      <>
        <Button
          icon={<Edit />}
          onClick={() => {
            console.log('!!!', selected, value);
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
        <Button icon={<Close />} onClick={() => onChange(undefined)} />
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
