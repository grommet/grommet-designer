import React, { useContext } from 'react';
import { Box, Button } from 'grommet';
import { Add, Close, Edit } from 'grommet-icons';
import { getComponent } from '../design2';
import SelectionContext from '../SelectionContext';

const ComponentInput = ({ componentId, name, onChange, value }) => {
  const [selection, setSelection] = useContext(SelectionContext);
  if (value && typeof value === 'string') return null;
  // if we have a value ensure we have a component there. if not, clear it
  if (value && !getComponent(value)) onChange(undefined);
  return (
    <Box direction="row">
      {value ? (
        <>
          <Button
            icon={<Edit />}
            onClick={() => {
              setSelection({
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
              // const nextDesign = JSON.parse(JSON.stringify(design));
              // const nextSelected = { ...selected };
              // onChange(undefined, nextDesign);
              // deleteComponent(nextDesign, value, nextSelected);
              // upgradeDesign(nextDesign); // clean up links
              // setSelected(nextSelected);
              // changeDesign(nextDesign);
            }}
          />
        </>
      ) : (
        <Button
          icon={<Add />}
          onClick={() => {
            setSelection({
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
