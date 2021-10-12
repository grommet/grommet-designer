import React, { useContext } from 'react';
import { Box, Button } from 'grommet';
import { Add, Close, Edit } from 'grommet-icons';
import DesignContext from '../DesignContext';
import { deleteComponent, upgradeDesign } from '../design';

const ComponentInput = ({ componentId, name, onChange, value }) => {
  const { changeDesign, design, selected, setSelected } =
    useContext(DesignContext);
  // if we have a value ensure we have a component there. if not, clear it
  if (value && !design.components[value]) onChange(undefined);
  return (
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
              changeDesign(nextDesign);
            }}
          />
        </>
      ) : (
        <Button
          icon={<Add />}
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
      )}
    </Box>
  );
};

export default ComponentInput;
