import React, { useContext } from 'react';
import { Box, Button, Heading, Stack } from 'grommet';
import { FormDown, FormNext } from 'grommet-icons';
import { getName, toggleCollapsed, useScreen } from '../design2';
import SelectionContext from '../SelectionContext';
import Component from './Component';
import DragDropContext from './DragDropContext';
import ScreenDropArea from './ScreenDropArea';

const Screen = ({ first, id }) => {
  const [selection, setSelection, { setLocation }] =
    useContext(SelectionContext);
  const [dragging, setDragging] = useContext(DragDropContext);

  const screen = useScreen(id);

  if (!screen) return null;

  const collapserColor = selection === id ? 'white' : 'border';
  const CollapseIcon = screen.collapsed ? FormNext : FormDown;

  return (
    <Box flex={false} border={first ? undefined : 'top'}>
      {first && <ScreenDropArea id={id} where="before" />}
      <Stack anchor="left">
        <Button
          fill
          hoverIndicator
          onClick={(event) => {
            if (event.shiftKey) setSelection(undefined);
            else {
              setLocation({ screen: id });
              setSelection(id);
            }
          }}
          draggable
          onDragStart={(event) => {
            event.dataTransfer.setData('text/plain', ''); // for Firefox
            setDragging(id);
          }}
          onDragEnd={() => {
            if (dragging === id) setDragging(undefined);
          }}
        >
          <Box
            direction="row"
            align="center"
            justify="between"
            gap="medium"
            pad={{ vertical: 'small', left: 'large', right: 'small' }}
            background={
              (selection === id && 'selected-background') || undefined
            }
          >
            <Heading
              level={3}
              size="xsmall"
              margin="none"
              color="selected-text"
            >
              {getName(id)}
            </Heading>
          </Box>
        </Button>
        {screen.root && (
          <Button
            icon={<CollapseIcon color={collapserColor} />}
            onClick={() => toggleCollapsed(id)}
          />
        )}
      </Stack>
      {!screen.collapsed && screen.root && (
        <Box
          flex={false}
          tabIndex="-1"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setLocation({ screen: id })}
        >
          <Component id={screen.root} />
        </Box>
      )}
      <ScreenDropArea id={id} where="after" />
    </Box>
  );
};

export default Screen;
