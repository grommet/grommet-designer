import React, { useCallback, useContext, useMemo, useState } from 'react';
import ReactGA from 'react-ga';
import { Box, Button, Heading, Layer } from 'grommet';
import { Close } from 'grommet-icons';
import DesignContext from '../DesignContext';
import {
  addComponent,
  addScreen,
  copyComponent,
  copyScreen,
  insertComponent,
} from '../design';
import AddComponents from './AddComponents';
import AddLocation from './AddLocation';

const AddComponent = ({ onClose }) => {
  const { changeDesign, design, imports, selected, setSelected } =
    useContext(DesignContext);
  const libraries = useMemo(
    () => imports.filter((i) => i.library).map((i) => i.library),
    [imports],
  );
  const [addLocation, setAddLocation] = useState();

  const onAdd = useCallback(
    ({ addMode, typeName, starter, template, templateDesign, url }) => {
      const nextDesign = JSON.parse(JSON.stringify(design));
      const nextSelected = { ...selected };

      if (typeName) {
        if (typeName === 'designer.Screen') {
          if (starter && starter !== 'default') {
            copyScreen(nextDesign, nextSelected, starter);
          } else {
            addScreen(nextDesign, nextSelected);
          }
        } else {
          if (starter && starter !== 'default') {
            const id = copyComponent({
              nextDesign,
              templateDesign: starter.starters,
              id: starter.id,
              screen: nextSelected.screen,
            });
            nextDesign.components[id].name = starter.name;
            nextSelected.component = id;
          } else {
            addComponent(nextDesign, libraries, nextSelected, typeName);
          }
        }
      } else if (template) {
        if (addMode === 'copy') {
          const id = copyComponent({
            nextDesign,
            templateDesign,
            id: template.id,
            screen: nextSelected.screen,
          });
          nextDesign.components[id].name = template.name;
          nextSelected.component = id;
        } else if (addMode === 'reference') {
          addComponent(
            nextDesign,
            libraries,
            nextSelected,
            'designer.Reference',
          );
          nextDesign.components[nextSelected.component].props.component =
            template.id;
          if (url) {
            nextDesign.components[nextSelected.component].props.design = {
              url,
            };
          }
        }
      }

      if (selected.screen === nextSelected.screen) {
        insertComponent({
          nextDesign,
          libraries,
          selected,
          id: nextSelected.component,
          location: addLocation,
        });
      }

      changeDesign(nextDesign);
      setSelected(nextSelected);
      onClose();

      ReactGA.event({
        category: 'edit',
        action: 'add component',
        label: typeName,
      });
    },
    [
      addLocation,
      changeDesign,
      design,
      libraries,
      onClose,
      selected,
      setSelected,
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
        {selected.component && (
          <Box flex={false} pad="small">
            <AddLocation
              design={design}
              libraries={libraries}
              selected={selected}
              onChange={(nextAddLocation) => setAddLocation(nextAddLocation)}
            />
          </Box>
        )}
        <Box flex overflow="auto">
          <AddComponents design={design} imports={imports} onAdd={onAdd} />
        </Box>
      </Box>
    </Layer>
  );
};

export default AddComponent;
