import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Box, Button, Keyboard, Text } from 'grommet';
import { Previous } from 'grommet-icons';
import {
  childSelected,
  copyComponent,
  duplicateComponent,
  getParent,
  getScreenForComponent,
  insertComponent,
  nextSiblingSelected,
  parentSelected,
  previousSiblingSelected,
  isDescendent,
  serialize,
} from '../design';
import { displayName } from '../utils';
import Component from './Component';
import DesignContext from './DesignContext';
import DragDropContext from './DragDropContext';
import Header from './Header';
import Screen from './Screen';

const within = (node, container) => {
  if (!node) return false;
  if (node === container) return true;
  return within(node.parentNode, container);
};

const Tree = ({
  design,
  imports,
  selected,
  setSelected,
  updateDesign,
  ...rest
}) => {
  const libraries = useMemo(
    () => imports.filter((i) => i.library).map((i) => i.library),
    [imports],
  );
  const selectedAncestors = useMemo(() => {
    const result = [];
    if (selected.component) {
      let parent = getParent(design, selected.component);
      while (parent) {
        result.push(parent.id);
        parent = getParent(design, parent.id);
      }
    }
    return result;
  }, [design, selected]);
  const [dragging, setDragging] = useState();
  const [dropTarget, setDropTarget] = useState();
  const [dropWhere, setDropWhere] = useState();
  const [draggingScreen, setDraggingScreen] = useState();
  const [dropScreenTarget, setDropScreenTarget] = useState();
  const [copied, setCopied] = useState();
  const treeRef = useRef();
  const selectedRef = useRef();

  // ensure selected component is visible in the tree
  React.useEffect(() => {
    // we use a timeout to give any expansion a chance to complete first
    const timer = setTimeout(() => {
      if (selectedRef.current) {
        const rect = selectedRef.current.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          selectedRef.current.scrollIntoView();
        }
        if (within(document.activeElement, treeRef.current)) {
          document.activeElement.blur();
        }
      }
    }, 20);
    return () => clearTimeout(timer);
  }, [selected]);

  // ensure selected component is expanded in the tree
  React.useEffect(() => {
    // only change local designs, otherwise we might have to prompt for change
    if (design.local && selected.component) {
      let parent = getParent(design, selected.component);
      while (parent && !parent.collapsed) {
        parent = getParent(design, parent.id);
      }
      if (parent) {
        const nextDesign = JSON.parse(JSON.stringify(design));
        nextDesign.components[parent.id].collapsed = false;
        updateDesign(nextDesign);
      } else {
        // if ancestors aren't collapsed, perhaps the screen is?
        if (design.screens[selected.screen].collapsed) {
          const nextDesign = JSON.parse(JSON.stringify(design));
          nextDesign.screens[selected.screen].collapsed = false;
          updateDesign(nextDesign);
        }
      }
    }
  }, [design, selected, updateDesign]);

  const moveComponent = useCallback(() => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    // remove from old parent
    const priorParent = getParent(nextDesign, dragging);
    const priorIndex = priorParent.children.indexOf(dragging);
    priorParent.children.splice(priorIndex, 1);
    // if we're moving within children, promote children first
    if (isDescendent(design, dropTarget, dragging)) {
      const component = nextDesign.components[dragging];
      priorParent.children = [...priorParent.children, ...component.children];
      component.children = undefined;
    }
    // insert into new parent
    if (dropWhere === 'in') {
      const nextParent = nextDesign.components[dropTarget];
      if (!nextParent.children) nextParent.children = [];
      nextParent.children.unshift(dragging);
    } else {
      const nextParent = getParent(nextDesign, dropTarget);
      const nextIndex = nextParent.children.indexOf(dropTarget);
      nextParent.children.splice(
        dropWhere === 'before' ? nextIndex : nextIndex + 1,
        0,
        dragging,
      );
    }
    const nextScreen = getScreenForComponent(nextDesign, dragging);
    setDragging(undefined);
    setDropTarget(undefined);
    updateDesign(nextDesign);
    setSelected({ ...selected, screen: nextScreen, component: dragging });
  }, [
    design,
    dragging,
    dropTarget,
    dropWhere,
    selected,
    setSelected,
    updateDesign,
  ]);

  const moveScreen = useCallback(() => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const moveIndex = nextDesign.screenOrder.indexOf(draggingScreen);
    nextDesign.screenOrder.splice(moveIndex, 1);
    const targetIndex = nextDesign.screenOrder.indexOf(dropScreenTarget);
    nextDesign.screenOrder.splice(
      dropWhere === 'before' ? targetIndex : targetIndex + 1,
      0,
      draggingScreen,
    );
    setDraggingScreen(undefined);
    setDropScreenTarget(undefined);
    updateDesign(nextDesign);
  }, [design, draggingScreen, dropScreenTarget, dropWhere, updateDesign]);

  // const toggleScreenCollapse = (id) => {
  //   const nextDesign = JSON.parse(JSON.stringify(design));
  //   const screen = nextDesign.screens[id];
  //   screen.collapsed = !screen.collapsed;
  //   updateDesign(nextDesign);
  //   const nextSelected = { ...selected };
  //   delete nextSelected.component;
  //   setSelected(nextSelected);
  // };

  const designContext = useMemo(
    () => ({
      design,
      imports,
      libraries,
      selected,
      selectedAncestors,
      selectedRef,
      setSelected,
      updateDesign,
    }),
    [
      design,
      imports,
      libraries,
      selected,
      selectedAncestors,
      setSelected,
      updateDesign,
    ],
  );

  const dragDropContext = useMemo(
    () => ({
      dragging,
      draggingScreen,
      dropScreenTarget,
      dropTarget,
      dropWhere,
      moveComponent,
      moveScreen,
      setDragging,
      setDraggingScreen,
      setDropScreenTarget,
      setDropTarget,
      setDropWhere,
    }),
    [
      dragging,
      draggingScreen,
      dropScreenTarget,
      dropTarget,
      dropWhere,
      moveComponent,
      moveScreen,
      setDropScreenTarget,
      setDropTarget,
      setDropWhere,
    ],
  );

  const toggleCollapse = (id) => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const component = nextDesign.components[id];
    component.collapsed = !component.collapsed;
    updateDesign(nextDesign);
    setSelected({ ...selected, component: id });
  };

  const onKey = (event) => {
    if (
      document.activeElement === document.body ||
      within(event.target, treeRef.current)
    ) {
      if (event.key === 'ArrowDown') {
        setSelected(nextSiblingSelected(design, selected) || selected);
      }
      if (event.key === 'ArrowUp') {
        setSelected(previousSiblingSelected(design, selected) || selected);
      }
      if (event.key === 'ArrowLeft') {
        setSelected(parentSelected(design, selected) || selected);
      }
      if (event.key === 'ArrowRight') {
        setSelected(childSelected(design, selected) || selected);
      }
      if (event.key === 'c' && (event.metaKey || event.ctrlKey)) {
        setCopied(selected);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(serialize(design, selected));
        }
      } else if (event.key === 'c') {
        toggleCollapse(selected.component);
      }
      if (event.key === 'v' && (event.metaKey || event.ctrlKey)) {
        if (copied) {
          const nextDesign = JSON.parse(JSON.stringify(design));
          const newId = duplicateComponent(
            nextDesign,
            copied.component,
            selected.component,
          );
          updateDesign(nextDesign);
          setSelected({ ...selected, component: newId });
        } else {
          if (navigator.clipboard && navigator.clipboard.readText) {
            navigator.clipboard.readText().then((clipText) => {
              const {
                design: copiedDesign,
                selected: copiedSelected,
              } = JSON.parse(clipText);
              const nextDesign = JSON.parse(JSON.stringify(design));
              const newId = copyComponent({
                nextDesign,
                templateDesign: copiedDesign,
                id: copiedSelected.component,
              });
              insertComponent({ nextDesign, libraries, selected, id: newId });

              updateDesign(nextDesign);
              setSelected({ ...selected, component: newId });
            });
          }
        }
      }
    }
  };

  return (
    <Keyboard target="document" onKeyDown={onKey}>
      <DesignContext.Provider value={designContext}>
        <DragDropContext.Provider value={dragDropContext}>
          <Box ref={treeRef} fill="vertical" overflow="auto" border="right">
            <Header {...rest} />

            <Box flex overflow="auto">
              <Box flex={false}>
                {selected.property ? (
                  <>
                    <Button
                      hoverIndicator
                      onClick={() => {
                        const {
                          property: { source },
                          ...nextSelected
                        } = selected;
                        nextSelected.component = source;
                        setSelected(nextSelected);
                      }}
                    >
                      <Box
                        direction="row"
                        pad="small"
                        gap="small"
                        border="bottom"
                      >
                        <Previous />
                        <Text>
                          back to{' '}
                          {displayName(
                            design.components[selected.property.source],
                          )}
                        </Text>
                      </Box>
                    </Button>
                    <Component
                      screen={selected.screen}
                      id={selected.property.component}
                    />
                  </>
                ) : (
                  design.screenOrder.map((sId, index) => (
                    <Screen
                      key={sId}
                      screenId={parseInt(sId, 10)}
                      firstScreen={index === 0}
                    />
                  ))
                )}
              </Box>
            </Box>
          </Box>
        </DragDropContext.Provider>
      </DesignContext.Provider>
    </Keyboard>
  );
};

export default Tree;
