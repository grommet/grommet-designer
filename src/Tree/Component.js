import React, { useContext, useState } from 'react';
import { Box, Button, Stack, Text } from 'grommet';
import { FormDown, FormNext } from 'grommet-icons';
import SelectionContext from '../SelectionContext';
import {
  getComponent,
  moveComponent,
  toggleCollapsed,
  useComponent,
} from '../design2';
import { displayName } from '../utils';
import ComponentDropArea from './ComponentDropArea';
import DragDropContext from './DragDropContext';

const treeSubName = (component) =>
  !component.name &&
  !component.text &&
  !component.props.name &&
  !component.props.label &&
  !component.props.icon
    ? undefined
    : component.type.split('.')[1] || component.type;

const Component = ({ screen, id, first }) => {
  const [selection, setSelection] = useContext(SelectionContext);
  const [dragging, setDragging] = useContext(DragDropContext);
  const [dragOver, setDragOver] = useState();

  const component = useComponent(id);
  if (!component) return null;

  let reference;
  if (component.type === 'designer.Reference')
    reference = getComponent(component.props.component);

  const collapserColor = selection === id ? 'white' : 'border';
  const CollapseIcon = component.collapsed ? FormNext : FormDown;

  return (
    <Box>
      {first && <ComponentDropArea id={id} where="before" />}
      <Stack anchor="left">
        <Button
          fill
          hoverIndicator
          onClick={(event) => setSelection(event.shiftKey ? undefined : id)}
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
          onDragLeave={() => setDragOver(false)}
          onDrop={() => {
            if (dragOver) {
              moveComponent(dragging, { within: id });
              setDragOver(false);
            }
          }}
        >
          <Box
            direction="row"
            align="center"
            gap="medium"
            pad={{ vertical: 'xsmall', left: 'large', right: 'small' }}
            background={
              (dragOver && 'focus') ||
              (selection === id && 'selected-background') ||
              undefined
            }
          >
            <Text size="medium" truncate>
              {displayName(
                component?.name ? component : reference || component,
              )}
            </Text>
            <Text size="small" truncate>
              {reference ? 'Reference' : treeSubName(component)}
            </Text>
          </Box>
        </Button>
        {component.children && (
          <Button
            icon={<CollapseIcon color={collapserColor} />}
            onClick={() => toggleCollapsed(id)}
          />
        )}
      </Stack>
      {!component.collapsed && component.children && (
        <Box pad={{ left: 'small' }}>
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
