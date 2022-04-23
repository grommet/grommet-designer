import React, { useContext } from 'react';
import { Box } from 'grommet';
import DragDropContext from './DragDropContext';

const ScreenDropArea = ({ id, where }) => {
  const {
    draggingScreen,
    dropScreenTarget,
    dropWhere,
    moveScreen,
    setDropScreenTarget,
    setDropWhere,
  } = useContext(DragDropContext);

  return (
    <Box
      pad="xxsmall"
      background={
        draggingScreen &&
        dropScreenTarget &&
        dropScreenTarget === id &&
        dropWhere === where
          ? 'focus'
          : undefined
      }
      onDragEnter={(event) => {
        if (draggingScreen && draggingScreen !== id) {
          event.preventDefault();
          setDropScreenTarget(id);
          setDropWhere(where);
        } else {
          setDropScreenTarget(undefined);
        }
      }}
      onDragOver={(event) => {
        if (draggingScreen && draggingScreen !== id) {
          event.preventDefault();
        }
      }}
      onDrop={moveScreen}
    />
  );
};

export default ScreenDropArea;
