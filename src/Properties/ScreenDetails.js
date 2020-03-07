import React from 'react';
import { Box, Heading, Keyboard } from 'grommet';
import { Duplicate, Trash } from 'grommet-icons';
import { addScreen, deleteScreen } from '../design';
import ActionButton from '../components/ActionButton';
import TextInputField from './TextInputField';

export const slugify = name =>
  `/${name
    .toLocaleLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')}`;

const ScreenDetails = ({ design, selected, setDesign, setSelected }) => {
  const delet = () => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const nextScreen = deleteScreen(nextDesign, selected.screen);
    const nextSelected = { screen: nextScreen };
    setSelected(nextSelected);
    setDesign(nextDesign);
  };

  const duplicate = () => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const nextSelected = { ...selected };
    addScreen(nextDesign, nextSelected, nextDesign.screens[selected.screen]);
    setDesign(nextDesign);
    setSelected(nextSelected);
  };

  const onKeyDown = event => {
    if (event.metaKey) {
      if (event.keyCode === 8) {
        // delete
        event.preventDefault();
        delet();
      }
    }
  };

  const screen = design.screens[selected.screen];
  if (!screen) return null;
  return (
    <Keyboard target="document" onKeyDown={onKeyDown}>
      <Box height="100vh" border="left">
        <Box
          flex={false}
          direction="row"
          align="center"
          justify="between"
          border="bottom"
        >
          <Box flex pad="small">
            <Heading level={2} size="18px" margin="none" truncate>
              Screen
            </Heading>
          </Box>
          <Box flex={false} direction="row" align="center">
            <ActionButton
              title="duplicate"
              icon={<Duplicate />}
              hoverIndicator
              onClick={duplicate}
            />
            {design.screenOrder.length > 1 && (
              <ActionButton
                title="delete"
                icon={<Trash />}
                hoverIndicator
                onClick={delet}
              />
            )}
          </Box>
        </Box>
        <Box flex overflow="auto">
          <Box flex={false}>
            <TextInputField
              name="name"
              componentId={screen.id}
              value={screen.name || ''}
              onChange={value => {
                const nextDesign = JSON.parse(JSON.stringify(design));
                nextDesign.screens[selected.screen].name = value;
                nextDesign.screens[selected.screen].path = slugify(value);
                setDesign(nextDesign);
              }}
            />
            <TextInputField
              name="path"
              componentId={screen.id}
              value={screen.path || ''}
              onChange={value => {
                const nextDesign = JSON.parse(JSON.stringify(design));
                nextDesign.screens[selected.screen].path = value;
                setDesign(nextDesign);
              }}
            />
          </Box>
        </Box>
      </Box>
    </Keyboard>
  );
};

export default ScreenDetails;
