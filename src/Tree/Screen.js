import React, { useContext } from 'react';
import { Box, Button, Heading, Stack } from 'grommet';
import { FormDown, FormNext } from 'grommet-icons';
import Component from './Component';
import DesignContext from './DesignContext';
import DragDropContext from './DragDropContext';
import ScreenDropArea from './ScreenDropArea';

const Screen = ({ firstScreen, screenId }) => {
  const {
    design,
    selected,
    selectedRef,
    setSelected,
    updateDesign,
  } = useContext(DesignContext);

  const {
    draggingScreen,
    moveScreen,
    setDraggingScreen,
    setDropScreenTarget,
  } = useContext(DragDropContext);

  const screen = design.screens[screenId];
  const isSelected = selected.screen === screenId && !selected.component;
  const collapserColor = 'border';

  const toggleScreenCollapse = () => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const screen = nextDesign.screens[screenId];
    screen.collapsed = !screen.collapsed;
    updateDesign(nextDesign);
    const nextSelected = { ...selected };
    delete nextSelected.component;
    setSelected(nextSelected);
  };

  return (
    <Box flex={false} border={firstScreen ? undefined : 'top'}>
      {firstScreen && <ScreenDropArea screenId={screenId} where="before" />}
      <Stack anchor="left">
        <Button
          fill
          hoverIndicator
          onClick={() => setSelected({ screen: screenId })}
          draggable
          onDragStart={(event) => {
            event.dataTransfer.setData('text/plain', ''); // for Firefox
            setDraggingScreen(screenId);
          }}
          onDragEnd={() => {
            setDraggingScreen(undefined);
            setDropScreenTarget(undefined);
          }}
          onDragOver={(event) => {
            if (draggingScreen && draggingScreen !== screenId) {
              event.preventDefault();
            }
          }}
          onDrop={moveScreen}
        >
          <Box
            ref={selected.component === screen.root ? selectedRef : undefined}
            direction="row"
            align="center"
            justify="between"
            gap="medium"
            pad={{ vertical: 'small', left: 'large', right: 'small' }}
            background={isSelected ? 'selected-background' : undefined}
          >
            <Heading
              level={3}
              size="xsmall"
              margin="none"
              color="selected-text"
            >
              {screen.name || `Screen ${screenId}`}
            </Heading>
          </Box>
        </Button>
        {screen.root && (
          <Button
            icon={
              screen.collapsed ? (
                <FormNext color={collapserColor} />
              ) : (
                <FormDown color={collapserColor} />
              )
            }
            onClick={toggleScreenCollapse}
          />
        )}
      </Stack>
      {!screen.collapsed && screen.root && (
        <Box flex={false}>
          <Component screen={screen.id} id={screen.root} />
        </Box>
      )}
      <ScreenDropArea screenId={screenId} where="after" />
    </Box>
  );
};

export default Screen;
