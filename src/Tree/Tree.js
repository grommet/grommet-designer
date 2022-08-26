import React, {
  // useCallback,
  useContext,
  // useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Box, Button, Keyboard, Paragraph, Text } from 'grommet';
import { Previous } from 'grommet-icons';
import {
  duplicateComponent,
  getName,
  getRoot,
  setScreenProperty,
  useScreens,
} from '../design2';
import SelectionContext from '../SelectionContext';
import DragDropContext from './DragDropContext';
import Header from './Header';
import Screen from './Screen';
import Component from './Component';
import Data from './Data';

const PropertyComponent = ({ id, value }) => {
  const [, setSelection, { setLocation }] = useContext(SelectionContext);

  return (
    <>
      <Button
        hoverIndicator
        onClick={() => {
          setLocation({ screen: getRoot(id) });
          setSelection(id);
        }}
      >
        <Box direction="row" pad="small" gap="small" border="bottom">
          <Previous />
          <Text>back to {getName(id)}</Text>
        </Box>
      </Button>
      {value && <Component id={value} />}
    </>
  );
};

const within = (node, container) => {
  if (!node) return false;
  if (node === container) return true;
  return within(node.parentNode, container);
};

// root is either undefined for all screens
// or { id, value, onChange } for property components
const Tree = ({ onClose, root, setMode }) => {
  const [selection, setSelection] = useContext(SelectionContext);
  const screens = useScreens();
  const [copied, setCopied] = useState();
  const treeRef = useRef();

  const [dragging, setDragging] = useState();
  const dragDropContext = useMemo(() => [dragging, setDragging], [dragging]);

  const onKey = (event) => {
    if (
      document.activeElement === document.body ||
      within(event.target, treeRef.current)
    ) {
      if (event.key === 'c' && (event.metaKey || event.ctrlKey)) {
        setCopied(selection);
        // if (navigator.clipboard && navigator.clipboard.writeText) {
        //   navigator.clipboard.writeText(serialize(design, selected));
        // }
      } else if (
        event.key === 'v' &&
        event.shiftKey &&
        (event.metaKey || event.ctrlKey)
      ) {
        // 'V' -> after
        if (copied && copied !== selection) {
          setSelection(duplicateComponent(copied, { after: selection }));
        }
      } else if (event.key === 'v' && (event.metaKey || event.ctrlKey)) {
        // 'v' -> within
        if (copied && copied !== selection) {
          setSelection(duplicateComponent(copied, { within: selection }));
        }
      } else if (event.key === 's') {
        screens.forEach((id) => setScreenProperty(id, 'collapsed', true));
      }
    }
  };

  return (
    <Keyboard target="document" onKeyDown={onKey}>
      <DragDropContext.Provider value={dragDropContext}>
        <Box ref={treeRef} height="100vh" border="right">
          <Header
            setMode={setMode}
            onClose={onClose}
            property={selection ? undefined : root}
          />

          <Box flex overflow="auto">
            <Box flex="grow">
              {(root && <PropertyComponent {...root} />) ||
                screens.map((id, index) => (
                  <Screen key={id} id={id} first={index === 0} />
                )) || (
                  <Paragraph margin="small" color="placeholder" textAlign="end">
                    Add a screen using the '+' above.
                  </Paragraph>
                )}
            </Box>
            <Data />
          </Box>
        </Box>
      </DragDropContext.Provider>
    </Keyboard>
  );
};

export default Tree;
