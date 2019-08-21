import React from 'react';
import { Box, Heading, Keyboard, TextInput } from 'grommet';
import { Duplicate, Trash } from 'grommet-icons';
import { addScreen } from './design';
import ActionButton from './components/ActionButton';
import Field from './components/Field';

const ScreenDetails = ({ colorMode, design, selected, onChange }) => {
  const [confirmDelete, setConfirmDelete] = React.useState();

  const onDelete = () => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    delete nextDesign.screens[selected.screen];
    const index = nextDesign.screenOrder.indexOf(selected.screen);
    nextDesign.screenOrder.splice(index, 1);
    const nextScreen = nextDesign.screenOrder[index ? index - 1 : index];
    const nextSelected = {
      screen: nextScreen,
      component: nextDesign.screens[nextScreen].root,
    };
    onChange({ design: nextDesign, selected: nextSelected });
    setConfirmDelete(false);
  }

  const onDuplicate = () => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const nextSelected = {};
    nextSelected.screen = addScreen(nextDesign, nextDesign.screens[selected.screen]);
    nextSelected.component = nextDesign.screens[nextSelected.screen].root;
    onChange({ design: nextDesign, selected: nextSelected });
  }

  const onKeyDown = (event) => {
    if (event.metaKey) {
      if (event.keyCode === 8) { // delete
        event.preventDefault();
        onDelete();
      }
    }
  }

  const PropertyField = ({name}) => (
    <Field label={name} htmlFor={name}>
      <TextInput
        id={name}
        name={name}
        plain
        value={screen[name] || ''}
        onChange={(event) => {
          const nextDesign = JSON.parse(JSON.stringify(design));
          nextDesign.screens[selected.screen][name] = event.target.value;
          onChange({ design: nextDesign });
        }}
        style={{ textAlign: 'end' }}
      />
    </Field>
  )

  const screen = design.screens[selected.screen];
  return (
    <Keyboard target="document" onKeyDown={onKeyDown}>
      <Box
        background={colorMode === 'dark' ? 'dark-1' : 'white'}
        height="100vh"
        border="left"
      >
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
              onClick={onDuplicate}
            />
            {confirmDelete && (
              <ActionButton
                title="confirm delete"
                icon={<Trash color="status-critical" />}
                hoverIndicator
                onClick={onDelete}
              />
            )}
            {design.screenOrder.length > 1 && (
              <ActionButton
                title="delete"
                icon={<Trash />}
                hoverIndicator
                onClick={() => setConfirmDelete(!confirmDelete)}
              />
            )}
          </Box>
        </Box>
        <Box flex overflow="auto">
          <Box flex={false}>
            <PropertyField name="name" />
            <PropertyField name="path" />
          </Box>
        </Box>
      </Box>
    </Keyboard>
  );
}

export default ScreenDetails;
