import React, { useContext, useRef, useState } from 'react';
import {
  Box,
  Button,
  Header as GrommetHeader,
  Keyboard,
  Layer,
  Menu,
  Text,
} from 'grommet';
import { Add, FormDown, Redo, Undo } from 'grommet-icons';
import ActionButton from '../components/ActionButton';
import AddComponent from './AddComponent';
import DesignContext from './DesignContext';
import DesignSettings from './DesignSettings';
import Sharing from './Share';

const within = (node, container) => {
  if (!node) return false;
  if (node === container) return true;
  return within(node.parentNode, container);
};

const Header = ({
  base,
  chooseDesign,
  colorMode,
  theme,
  setMode,
  onUndo,
  onRedo,
}) => {
  const { design, imports, selected, setSelected, updateDesign } = useContext(
    DesignContext,
  );
  const [adding, setAdding] = useState();
  const [editing, setEditing] = useState();
  const [sharing, setSharing] = useState();
  const [deleting, setDeleting] = useState();
  const ref = useRef();

  const onKey = (event) => {
    if (
      document.activeElement === document.body ||
      within(event.target, ref.current)
    ) {
      if (event.key === 'a') {
        setAdding(true);
      }
      if (onUndo && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        onUndo();
      }
      if (onRedo && event.key === 'z' && event.shiftKey) {
        event.preventDefault();
        onRedo();
      }
    }
  };

  return (
    <Keyboard target="document" onKeyDown={onKey}>
      <Box ref={ref} flex={false} border="bottom">
        <GrommetHeader border="bottom" gap="none">
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
                { label: 'close', onClick: () => chooseDesign(undefined) },
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
        </GrommetHeader>
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
                  chooseDesign(undefined);
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
            setDesign={updateDesign}
            onClose={() => setSharing(false)}
          />
        )}
        {adding && (
          <AddComponent
            design={design}
            imports={imports}
            base={base}
            selected={selected}
            setDesign={updateDesign}
            setSelected={setSelected}
            onClose={() => setAdding(false)}
          />
        )}
        {editing && (
          <DesignSettings
            design={design}
            theme={theme}
            setDesign={updateDesign}
            onClose={() => setEditing(false)}
          />
        )}
      </Box>
    </Keyboard>
  );
};

export default Header;
