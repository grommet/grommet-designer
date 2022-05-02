import React, {
  // useCallback,
  useContext,
  // useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Box, Button, Keyboard, Text } from 'grommet';
import { Previous } from 'grommet-icons';
import {
  duplicateComponent,
  getName,
  getRoot,
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

  // const selectedAncestors = useMemo(() => {
  //   const result = [];
  //   if (selected.component) {
  //     let parent = getParent(design, selected.component);
  //     while (parent) {
  //       result.push(parent.id);
  //       parent = getParent(design, parent.id);
  //     }
  //   }
  //   return result;
  // }, [design, selected]);

  const [copied, setCopied] = useState();
  const treeRef = useRef();
  // const selectionRef = useRef();

  // ensure selected component is visible in the tree
  // useEffect(() => {
  //   // we use a timeout to give any expansion a chance to complete first
  //   const timer = setTimeout(() => {
  //     if (selectionRef.current) {
  //       const rect = selectionRef.current.getBoundingClientRect();
  //       if (rect.bottom < 0 || rect.top > window.innerHeight) {
  //         selectionRef.current.scrollIntoView();
  //       }
  //       if (within(document.activeElement, treeRef.current)) {
  //         document.activeElement.blur();
  //       }
  //     }
  //   }, 20);
  //   return () => clearTimeout(timer);
  // }, [selection]);

  // // ensure selected component is expanded in the tree
  // useEffect(() => {
  //   // only change local designs, otherwise we might have to prompt for change
  //   if (design.local && selected.component) {
  //     let parent = getParent(design, selected.component);
  //     while (parent && !parent.collapsed) {
  //       parent = getParent(design, parent.id);
  //     }
  //     if (parent) {
  //       const nextDesign = JSON.parse(JSON.stringify(design));
  //       nextDesign.components[parent.id].collapsed = false;
  //       updateDesign(nextDesign);
  //     } else {
  //       // if ancestors aren't collapsed, perhaps the screen is?
  //       if (design.screens[selected.screen].collapsed) {
  //         const nextDesign = JSON.parse(JSON.stringify(design));
  //         nextDesign.screens[selected.screen].collapsed = false;
  //         updateDesign(nextDesign);
  //       }
  //     }
  //   }
  // }, [design, selected, updateDesign]);

  const [dragging, setDragging] = useState();
  const dragDropContext = useMemo(() => [dragging, setDragging], [dragging]);

  const onKey = (event) => {
    if (
      document.activeElement === document.body ||
      within(event.target, treeRef.current)
    ) {
      // if (event.key === 'ArrowDown') {
      //   setSelected(nextSiblingSelected(design, selected) || selected);
      // }
      // if (event.key === 'ArrowUp') {
      //   setSelected(previousSiblingSelected(design, selected) || selected);
      // }
      // if (event.key === 'ArrowLeft') {
      //   setSelected(parentSelected(design, selected) || selected);
      // }
      // if (event.key === 'ArrowRight') {
      //   setSelected(childSelected(design, selected) || selected);
      // }
      if (event.key === 'c' && (event.metaKey || event.ctrlKey)) {
        setCopied(selection);
        // if (navigator.clipboard && navigator.clipboard.writeText) {
        //   navigator.clipboard.writeText(serialize(design, selected));
        // }
        // } else if (event.key === 'c') {
        //   toggleCollapse(selected.component);
      } else if (event.key === 'v' && (event.metaKey || event.ctrlKey)) {
        // 'v' -> within
        if (copied && copied !== selection) {
          setSelection(duplicateComponent(copied, { within: selection }));
        }
      } else if (event.key === 'V' && (event.metaKey || event.ctrlKey)) {
        // 'V' -> after
        if (copied && copied !== selection) {
          setSelection(duplicateComponent(copied, { after: selection }));
        }
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
              {root ? (
                <PropertyComponent {...root} />
              ) : (
                screens.map((id, index) => (
                  <Screen key={id} id={id} first={index === 0} />
                ))
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
