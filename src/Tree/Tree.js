import React from 'react';
import {
  Box,
  Button,
  Header,
  Heading,
  Keyboard,
  Layer,
  Menu,
  Stack,
  Text,
} from 'grommet';
import { Add, FormDown, FormNext, Redo, Undo } from 'grommet-icons';
import {
  canParent,
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
import { displayName, getReferenceDesign } from '../utils';
import ActionButton from '../components/ActionButton';
import AddComponent from './AddComponent';
import DesignSettings from './DesignSettings';
import Sharing from './Share';

const treeSubName = component =>
  !component.name &&
  !component.text &&
  !component.props.name &&
  !component.props.label &&
  !component.props.icon
    ? undefined
    : component.type.split('.')[1] || component.type;

const within = (node, container) => {
  if (!node) return false;
  if (node === container) return true;
  return within(node.parentNode, container);
};

const Tree = ({
  base,
  colorMode,
  design,
  imports,
  selected,
  theme,
  setDesign,
  setMode,
  setSelected,
  onUndo,
  onRedo,
}) => {
  const libraries = React.useMemo(
    () => imports.filter(i => i.library).map(i => i.library),
    [imports],
  );
  const selectedAncestors = React.useMemo(() => {
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
  const [dragging, setDragging] = React.useState();
  const [dropTarget, setDropTarget] = React.useState();
  const [dropWhere, setDropWhere] = React.useState();
  const [draggingScreen, setDraggingScreen] = React.useState();
  const [dropScreenTarget, setDropScreenTarget] = React.useState();
  const [adding, setAdding] = React.useState();
  const [editing, setEditing] = React.useState(design.name === 'new design');
  const [sharing, setSharing] = React.useState();
  const [copied, setCopied] = React.useState();
  const [deleting, setDeleting] = React.useState();
  const treeRef = React.useRef();
  const selectedRef = React.useRef();

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
        setDesign(nextDesign);
      }
    }
  }, [design, selected.component, setDesign]);

  const moveChild = () => {
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
    setDesign(nextDesign);
    setSelected({ screen: nextScreen, component: dragging });
  };

  const moveScreen = () => {
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
    setDesign(nextDesign);
  };

  const toggleScreenCollapse = id => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const screen = nextDesign.screens[id];
    screen.collapsed = !screen.collapsed;
    setDesign(nextDesign);
    const nextSelected = { ...selected };
    delete nextSelected.component;
    setSelected(nextSelected);
  };

  const toggleCollapse = id => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const component = nextDesign.components[id];
    component.collapsed = !component.collapsed;
    setDesign(nextDesign);
    setSelected({ ...selected, component: id });
  };

  const onKey = event => {
    if (
      document.activeElement === document.body ||
      within(event.target, treeRef.current)
    ) {
      if (event.key === 'a') {
        setAdding(true);
      }
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
      if (onUndo && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        onUndo();
      }
      if (onRedo && event.key === 'z' && event.shiftKey) {
        event.preventDefault();
        onRedo();
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
          setDesign(nextDesign);
          setSelected({ ...selected, component: newId });
        } else {
          if (navigator.clipboard && navigator.clipboard.readText) {
            navigator.clipboard.readText().then(clipText => {
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

              setDesign(nextDesign);
              setSelected({ ...selected, component: newId });
            });
          }
        }
      }
    }
  };

  const renderDropArea = (id, where) => {
    return (
      <Box
        pad="xxsmall"
        background={
          dragging && dropTarget && dropTarget === id && dropWhere === where
            ? 'focus'
            : undefined
        }
        onDragEnter={event => {
          if (dragging && dragging !== id) {
            event.preventDefault();
            setDropTarget(id);
            setDropWhere(where);
          } else {
            setDropTarget(undefined);
          }
        }}
        onDragOver={event => {
          if (dragging && dragging !== id) {
            event.preventDefault();
          }
        }}
        onDrop={moveChild}
      />
    );
  };

  const renderScreenDropArea = (screenId, where) => {
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
        onDragEnter={event => {
          if (draggingScreen && draggingScreen !== screenId) {
            event.preventDefault();
            setDropScreenTarget(screenId);
            setDropWhere(where);
          } else {
            setDropScreenTarget(undefined);
          }
        }}
        onDragOver={event => {
          if (draggingScreen && draggingScreen !== screenId) {
            event.preventDefault();
          }
        }}
        onDrop={moveScreen}
      />
    );
  };

  const renderComponent = (screen, id, firstChild) => {
    const component = design.components[id];
    if (!component) return null;
    let reference;
    if (component.type === 'designer.Reference') {
      const referenceDesign = getReferenceDesign(imports, component);
      reference = (referenceDesign || design).components[
        component.props.component
      ];
    }
    const collapserColor = selectedAncestors.includes(id)
      ? 'selected-background'
      : 'border';
    return (
      <Box key={id}>
        {firstChild && renderDropArea(id, 'before')}
        <Stack anchor="left">
          <Button
            fill
            hoverIndicator
            onClick={() => setSelected({ screen, component: id })}
            draggable={!component.coupled}
            onDragStart={event => {
              event.dataTransfer.setData('text/plain', ''); // for Firefox
              setDragging(id);
            }}
            onDragEnd={() => {
              setDragging(undefined);
              setDropTarget(undefined);
            }}
            onDragEnter={() => {
              if (
                dragging &&
                dragging !== id &&
                canParent(design, libraries, component)
              ) {
                setDropTarget(id);
                setDropWhere('in');
              }
            }}
            onDragOver={event => {
              if (dragging && dragging !== id) {
                event.preventDefault();
              }
            }}
            onDrop={moveChild}
          >
            <Box
              ref={selected.component === id ? selectedRef : undefined}
              direction="row"
              align="center"
              gap="medium"
              pad={{ vertical: 'xsmall', left: 'large', right: 'small' }}
              background={
                dropTarget && dropTarget === id && dropWhere === 'in'
                  ? 'focus'
                  : selected.component === id
                  ? 'selected-background'
                  : undefined
              }
            >
              <Text size="medium" truncate>
                {displayName(reference || component)}
              </Text>
              <Text size="small" truncate>
                {reference ? 'Reference' : treeSubName(component)}
              </Text>
            </Box>
          </Button>
          {(component.children || component.propComponents) && (
            <Button
              icon={
                component.collapsed ? (
                  <FormNext color={collapserColor} />
                ) : (
                  <FormDown color={collapserColor} />
                )
              }
              onClick={() => toggleCollapse(id)}
            />
          )}
        </Stack>
        {!component.collapsed && component.children && (
          <Box pad={{ left: 'small' }}>
            {component.children.map((childId, index) =>
              renderComponent(screen, childId, index === 0),
            )}
          </Box>
        )}
        {!component.collapsed && component.propComponents && (
          <Box pad={{ left: 'small' }}>
            {component.propComponents.map((propId, index) =>
              renderComponent(screen, propId, index === 0),
            )}
          </Box>
        )}
        {renderDropArea(id, 'after')}
      </Box>
    );
  };

  const renderScreen = (screenId, firstScreen) => {
    const screen = design.screens[screenId];
    const isSelected = selected.screen === screenId && !selected.component;
    const collapserColor = 'border';
    return (
      <Box
        key={screen.id}
        flex={false}
        border={firstScreen ? undefined : 'top'}
      >
        {firstScreen && renderScreenDropArea(screenId, 'before')}
        <Stack anchor="left">
          <Button
            fill
            hoverIndicator
            onClick={() => setSelected({ screen: screenId })}
            draggable
            onDragStart={event => {
              event.dataTransfer.setData('text/plain', ''); // for Firefox
              setDraggingScreen(screenId);
            }}
            onDragEnd={() => {
              setDraggingScreen(undefined);
              setDropScreenTarget(undefined);
            }}
            onDragOver={event => {
              if (draggingScreen && draggingScreen !== screenId) {
                event.preventDefault();
              }
            }}
            onDrop={moveScreen}
          >
            <Box
              ref={selected.component === screen.root ? selectedRef : undefined}
              direction="row"
              align="center"
              justify="between"
              gap="medium"
              pad={{ vertical: 'small', left: 'large', right: 'small' }}
              background={isSelected ? 'selected-background' : undefined}
            >
              <Heading
                level={3}
                size="xsmall"
                margin="none"
                color="selected-text"
              >
                {screen.name || `Screen ${screenId}`}
              </Heading>
            </Box>
          </Button>
          {screen.root && (
            <Button
              icon={
                screen.collapsed ? (
                  <FormNext color={collapserColor} />
                ) : (
                  <FormDown color={collapserColor} />
                )
              }
              onClick={() => toggleScreenCollapse(screenId)}
            />
          )}
        </Stack>
        {!screen.collapsed && screen.root && (
          <Box flex={false}>{renderComponent(screen.id, screen.root)}</Box>
        )}
        {renderScreenDropArea(screenId, 'after')}
      </Box>
    );
  };

  return (
    <Keyboard target="document" onKeyDown={onKey}>
      <Box ref={treeRef} fill="vertical" overflow="auto" border="right">
        <Box flex={false} border="bottom">
          <Header border="bottom" gap="none">
            <Box flex>
              <Menu
                hoverIndicator
                dropProps={{ align: { top: 'bottom' } }}
                items={[
                  { label: 'configure', onClick: () => setEditing(true) },
                  { label: 'share', onClick: () => setSharing(true) },
                  {
                    label: `preview ${
                      /Mac/i.test(navigator.platform) ? '⌘' : 'Ctrl+'
                    }.`,
                    onClick: () => setMode('preview'),
                  },
                  {
                    label: `comments ${
                      /Mac/i.test(navigator.platform) ? '⌘' : 'Ctrl+'
                    };`,
                    onClick: () => setMode('comments'),
                  },
                  { label: 'close', onClick: () => setDesign(undefined) },
                  { label: 'delete ...', onClick: () => setDeleting(true) },
                ]}
              >
                <Box
                  flex="shrink"
                  direction="row"
                  align="center"
                  pad="small"
                  gap="small"
                >
                  <Text
                    weight="bold"
                    truncate
                    size={design.name.length > 20 ? 'small' : undefined}
                  >
                    {design.name}
                  </Text>
                  <FormDown color="control" />
                </Box>
              </Menu>
            </Box>
            <Box flex={false} direction="row" align="center">
              <ActionButton
                title="undo last change"
                icon={<Undo />}
                disabled={!onUndo}
                onClick={onUndo || undefined}
              />
              <ActionButton
                title="redo last change"
                icon={<Redo />}
                disabled={!onRedo}
                onClick={onRedo || undefined}
              />
              <ActionButton
                title="add a component"
                icon={<Add />}
                onClick={() => setAdding(true)}
              />
            </Box>
          </Header>
          {deleting && (
            <Layer
              position="center"
              margin="medium"
              animation="fadeIn"
              onEsc={() => setDeleting(false)}
              onClickOutside={() => setDeleting(false)}
            >
              <Box flex elevation="medium" pad="large">
                <Button
                  label="Confirm delete"
                  onClick={() => {
                    localStorage.removeItem(`${design.name}--state`);
                    localStorage.removeItem(design.name);
                    setDesign(undefined);
                  }}
                />
              </Box>
            </Layer>
          )}
          {sharing && (
            <Sharing
              design={design}
              imports={imports}
              theme={theme}
              colorMode={colorMode}
              setDesign={setDesign}
              onClose={() => setSharing(false)}
            />
          )}
          {adding && (
            <AddComponent
              design={design}
              imports={imports}
              base={base}
              selected={selected}
              setDesign={setDesign}
              setSelected={setSelected}
              onClose={() => setAdding(false)}
            />
          )}
          {editing && (
            <DesignSettings
              design={design}
              theme={theme}
              setDesign={setDesign}
              onClose={() => setEditing(false)}
            />
          )}
        </Box>

        <Box flex overflow="auto">
          <Box flex={false}>
            {design.screenOrder.map((sId, index) =>
              renderScreen(
                parseInt(sId, 10),
                index === 0,
                design.screenOrder.length === 1,
              ),
            )}
          </Box>
        </Box>
      </Box>
    </Keyboard>
  );
};

export default Tree;
