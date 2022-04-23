import React, { useCallback, useContext, useState } from 'react';
import ReactGA from 'react-ga';
import { Box, Button, Heading, Layer } from 'grommet';
import { Close } from 'grommet-icons';
import SelectionContext from '../SelectionContext';
import { addComponent, addScreen, useComponent } from '../design2';
// import {
//   addComponent,
//   addScreen,
//   copyComponent,
//   copyScreen,
//   insertComponent,
// } from '../design';
import AddComponents from './AddComponents';
import AddLocation from './AddLocation';

const AddComponent = ({ onClose }) => {
  const [selection, setSelection] = useContext(SelectionContext);
  const component = useComponent(selection);
  // const { changeDesign, design, imports, libraries, selected, setSelected } =
  //   useContext(DesignContext);
  const [addLocation, setAddLocation] = useState('within');

  const onAdd = useCallback(
    ({ typeName }) => {
      if (typeName === 'designer.Screen') {
        // if (starter && starter !== 'default') {
        //   copyScreen({ nextDesign, nextSelected, starter, libraries });
        // } else {
        const screen = addScreen();
        setSelection(screen.id);
        // }
      } else {
        // if (starter && starter !== 'default') {
        //   const id = copyComponent({
        //     nextDesign,
        //     templateDesign: starter.starters,
        //     id: starter.id,
        //     libraries,
        //     screen: nextSelected.screen,
        //   });
        //   nextDesign.components[id].name = starter.name;
        //   nextSelected.component = id;
        // } else {
        const component = addComponent(typeName, { [addLocation]: selection });
        setSelection(component.id);
        // }
      }
      // } else if (template) {
      //   if (addMode === 'copy') {
      //     const id = copyComponent({
      //       nextDesign,
      //       templateDesign,
      //       id: template.id,
      //       libraries,
      //       screen: nextSelected.screen,
      //     });
      //     nextDesign.components[id].name = template.name;
      //     nextSelected.component = id;
      //   } else if (addMode === 'reference') {
      //     addComponent(
      //       nextDesign,
      //       libraries,
      //       nextSelected,
      //       'designer.Reference',
      //     );
      //     nextDesign.components[nextSelected.component].props.component =
      //       template.id;
      //     if (url) {
      //       nextDesign.components[nextSelected.component].props.design = {
      //         url,
      //       };
      //     }
      //   }
      // }

      // if (selected.screen === nextSelected.screen) {
      //   insertComponent({
      //     nextDesign,
      //     libraries,
      //     selected,
      //     id: nextSelected.component,
      //     location: addLocation,
      //   });
      // }

      // changeDesign(nextDesign);
      // setSelected(nextSelected);
      onClose();

      ReactGA.event({
        category: 'edit',
        action: 'add component',
        label: typeName,
      });
    },
    [
      // addLocation,
      // changeDesign,
      // design,
      // libraries,
      // onClose,
      // selected,
      // setSelected,
    ],
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
