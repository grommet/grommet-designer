import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Box, Button, Text } from 'grommet';
import { FormDown, FormNext } from 'grommet-icons';
import SelectionContext from '../SelectionContext';
import {
  getComponent,
  getName,
  moveComponent,
  toggleCollapsed,
  useComponent,
} from '../design2';
import ComponentDropArea from './ComponentDropArea';
import DragDropContext from './DragDropContext';

const NonInteractiveBox = styled(Box)`
  pointer-events: none;
`;

const Component = ({ id, first }) => {
  const [selection, setSelection, { selectionPath }] =
    useContext(SelectionContext);
  const [dragging, setDragging] = useContext(DragDropContext);
  const [dragOver, setDragOver] = useState();
  const selectionRef = useRef();

  const component = useComponent(id);

  // scroll to show if selected component
  useEffect(() => {
    if (id === selection && selectionRef.current) {
      const rect = selectionRef.current.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        selectionRef.current.scrollIntoView();
      }
    }
  }, [id, selection]);

  if (!component) return null;

  const name = getName(id);
  const subName = component.type.split('.')[1] || component.type;
  const selectionAncestor = selectionPath.includes(id);

  const CollapseIcon = component.collapsed ? FormNext : FormDown;

  return (
    <Box>
      {first && <ComponentDropArea id={id} where="before" />}
      <Box
        direction="row"
        pad={!component.children ? { left: 'xsmall' } : undefined}
      >
        {component.children ? (
          <Button
            title={`toggle collapse ${name}`}
            aria-label={`${
              component.collapsed ? 'Expand' : 'Collapse'
            } ${name}`}
            hoverIndicator
            onClick={() => toggleCollapsed(id)}
          >
            <Box pad="xxsmall">
              <CollapseIcon color="border" />
            </Box>
          </Button>
        ) : (
          <Box pad="small" />
        )}
        <Box
          flex
          draggable={!component.coupled}
          onDragStart={(event) => {
            event.dataTransfer.setData('text/plain', ''); // for Firefox
            setDragging(id);
          }}
          onDragEnd={() => {
            if (dragging === id) setDragging(undefined);
          }}
          onDragEnter={(event) => {
            if (dragging && dragging !== id && getComponent(dragging)) {
              event.preventDefault();
              setDragOver(true);
            }
          }}
          onDragOver={(event) => {
            if (dragOver) event.preventDefault();
          }}
          onDragLeave={() => {
            setDragOver(false);
          }}
          onDrop={() => {
            if (dragOver) {
              moveComponent(dragging, { within: id });
              setDragOver(false);
            }
          }}
        >
          <Button
            ref={id === selection ? selectionRef : undefined}
            fill
            hoverIndicator
            aria-label={`Select ${name}`}
            onClick={(event) => setSelection(event.shiftKey ? undefined : id)}
          >
            <NonInteractiveBox
              direction="row"
              align="center"
              gap="medium"
              pad={{ vertical: 'xxsmall', horizontal: 'small' }}
              background={
                (dragOver && 'focus') ||
                (dragging === id && 'background-contrast') ||
                (selection === id && 'selected-background') ||
                (selectionAncestor && 'background-contrast') ||
                undefined
              }
            >
              <Text size="medium" truncate>
                {name}
              </Text>
              {subName !== name && (
                <Text size="small" truncate>
                  {subName}
                </Text>
              )}
            </NonInteractiveBox>
          </Button>
        </Box>
      </Box>
      {!component.collapsed && component.children && (
        <Box pad={{ left: 'xsmall' }}>
          {component.children.map((childId, index) => (
            <Component key={childId} id={childId} first={index === 0} />
          ))}
        </Box>
      )}
      <ComponentDropArea id={id} where="after" />
    </Box>
  );
};

export default Component;
