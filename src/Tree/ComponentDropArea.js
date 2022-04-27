import React, { useContext, useState } from 'react';
import { Box } from 'grommet';
import { getComponent, moveComponent } from '../design2';
import DragDropContext from './DragDropContext';

const ComponentDropArea = ({ id, where }) => {
  const [dragging] = useContext(DragDropContext);
  const [dragOver, setDragOver] = useState();

  return (
    <Box
      pad="xxsmall"
      background={(dragOver && 'focus') || undefined}
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
          moveComponent(dragging, { [where]: id });
          setDragOver(false);
        }
      }}
    />
  );
};

export default ComponentDropArea;
