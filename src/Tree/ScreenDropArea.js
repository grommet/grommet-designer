import React, { useContext } from 'react';
import { Box } from 'grommet';
import DragDropContext from './DragDropContext';

const ScreenDropArea = ({ screenId, where }) => {
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
        dropScreenTarget === screenId &&
        dropWhere === where
          ? 'focus'
          : undefined
      }
      onDragEnter={(event) => {
        if (draggingScreen && draggingScreen !== screenId) {
          event.preventDefault();
          setDropScreenTarget(screenId);
          setDropWhere(where);
        } else {
          setDropScreenTarget(undefined);
        }
      }}
      onDragOver={(event) => {
        if (draggingScreen && draggingScreen !== screenId) {
          event.preventDefault();
        }
      }}
      onDrop={moveScreen}
    />
  );
};

export default ScreenDropArea;
