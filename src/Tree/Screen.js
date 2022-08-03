import React, { useContext } from 'react';
import { Box, Button, Heading } from 'grommet';
import { FormDown, FormNext } from 'grommet-icons';
import { getName, toggleCollapsed, useScreen } from '../design2';
import SelectionContext from '../SelectionContext';
import Component from './Component';
import DragDropContext from './DragDropContext';
import ScreenDropArea from './ScreenDropArea';

const Screen = ({ first, id }) => {
  const [selection, setSelection, { setLocation, selectionPath }] =
    useContext(SelectionContext);
  const [dragging, setDragging] = useContext(DragDropContext);

  const screen = useScreen(id);

  if (!screen) return null;

  const name = getName(id);
  const selectionAncestor = selectionPath.includes(id);

  const CollapseIcon = screen.collapsed ? FormNext : FormDown;

  return (
    <Box flex={false} border={first ? undefined : 'top'}>
      {first && <ScreenDropArea id={id} where="before" />}
      <Box direction="row">
        {screen.root && (
          <Button
            title={`toggle collapse ${name}`}
            hoverIndicator
            onClick={() => toggleCollapsed(id)}
          >
            <Box pad="xxsmall">
              <CollapseIcon color="border" />
            </Box>
          </Button>
        )}
        <Box
          flex
          draggable
          onDragStart={(event) => {
            event.dataTransfer.setData('text/plain', ''); // for Firefox
            setDragging(id);
          }}
          onDragEnd={() => {
            if (dragging === id) setDragging(undefined);
          }}
        >
          <Button
            fill
            hoverIndicator
            aria-label={`Select ${name}`}
            onClick={(event) => {
              if (event.shiftKey) setSelection(undefined);
              else {
                setLocation({ screen: id });
                setSelection(id);
              }
            }}
          >
            <Box
              pad={{ vertical: 'xsmall', horizontal: 'small' }}
              background={
                (selection === id && 'selected-background') ||
                (selectionAncestor && 'background-contrast') ||
                undefined
              }
            >
              <Heading
                level={3}
                size="xsmall"
                margin="none"
                color="selected-text"
              >
                {name}
              </Heading>
            </Box>
          </Button>
        </Box>
      </Box>

      {!screen.collapsed && screen.root && (
        <Box
          flex={false}
          pad={{ left: 'xsmall' }}
          tabIndex="-1"
          onClick={() => setLocation({ screen: id })}
        >
          <Box pad="xxsmall" />
          <Component id={screen.root} />
        </Box>
      )}
      <ScreenDropArea id={id} where="after" />
    </Box>
  );
};

export default Screen;
