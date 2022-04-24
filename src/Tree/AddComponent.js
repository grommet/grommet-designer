import React, { useCallback, useContext, useState } from 'react';
import ReactGA from 'react-ga';
import { Box, Button, Heading, Layer } from 'grommet';
import { Close } from 'grommet-icons';
import SelectionContext from '../SelectionContext';
import { addComponent, addScreen, useComponent } from '../design2';
import AddComponents from './AddComponents';
import AddLocation from './AddLocation';

const AddComponent = ({ onClose }) => {
  const [selection, setSelection] = useContext(SelectionContext);
  const component = useComponent(selection);
  const [addLocation, setAddLocation] = useState('within');

  const onAdd = useCallback(
    ({ typeName }) => {
      if (typeName === 'designer.Screen') {
        const screen = addScreen();
        setSelection(screen.id);
      } else {
        const component = addComponent(typeName, { [addLocation]: selection });
        setSelection(component.id);
      }

      onClose();

      ReactGA.event({
        category: 'edit',
        action: 'add component',
        label: typeName,
      });
    },
    [ addLocation, onClose, selection, setSelection ],
  );

  return (
    <Layer
      position="top-left"
      margin="medium"
      full="vertical"
      onEsc={onClose}
      onClickOutside={onClose}
    >
      <Box flex elevation="medium">
        <Box flex={false} direction="row" justify="between" align="center">
          <Button
            title="close"
            tip="close"
            icon={<Close />}
            onClick={onClose}
          />
          <Heading
            level={2}
            size="small"
            margin={{ vertical: 'none', horizontal: 'small' }}
          >
            add
          </Heading>
        </Box>
        {component && (
          <Box flex={false} pad="small">
            <AddLocation
              onChange={(nextAddLocation) => setAddLocation(nextAddLocation)}
            />
          </Box>
        )}
        <Box flex overflow="auto">
          <AddComponents onAdd={onAdd} />
        </Box>
      </Box>
    </Layer>
  );
};

export default AddComponent;
