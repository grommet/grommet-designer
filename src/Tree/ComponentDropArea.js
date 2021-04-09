import React, { useContext } from 'react';
import { Box } from 'grommet';
import DragDropContext from './DragDropContext';

const ComponentDropArea = ({ id, where }) => {
  const {
    dragging,
    dropTarget,
    dropWhere,
    moveChild,
    setDropTarget,
    setDropWhere,
  } = useContext(DragDropContext);

  return (
    <Box
      pad="xxsmall"
      background={
        dragging && dropTarget && dropTarget === id && dropWhere === where
          ? 'focus'
          : undefined
      }
      onDragEnter={(event) => {
        if (dragging && dragging !== id) {
          event.preventDefault();
          setDropTarget(id);
          setDropWhere(where);
        } else {
          setDropTarget(undefined);
        }
      }}
      onDragOver={(event) => {
        if (dragging && dragging !== id) {
          event.preventDefault();
        }
      }}
      onDrop={moveChild}
    />
  );
};

export default ComponentDropArea;
