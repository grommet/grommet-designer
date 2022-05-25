import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Footer,
  Header as GrommetHeader,
  Keyboard,
  Layer,
  Menu,
  Paragraph,
  Text,
} from 'grommet';
import { Add, FormDown, Redo, Undo } from 'grommet-icons';
import { getDesign, removeDesign, useChanges } from '../design2';
import AddComponent from './AddComponent';
import DesignSettings from './DesignSettings';
import Help from './Help';
import Sharing from './Share';

const within = (node, container) => {
  if (!node) return false;
  if (node === container) return true;
  return within(node.parentNode, container);
};

const Header = ({ onClose, property, setMode }) => {
  const [adding, setAdding] = useState();
  const [editing, setEditing] = useState();
  const [sharing, setSharing] = useState();
  const [deleting, setDeleting] = useState();
  const [help, setHelp] = useState();
  const { undo, redo } = useChanges();
  const ref = useRef();

  const onKey = (event) => {
    if (
      document.activeElement === document.body ||
      within(event.target, ref.current)
    ) {
      if (event.key === 'a') {
        setAdding(true);
      }
      if (undo && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undo();
      }
      if (redo && (event.key === 'z' || event.key === 'Z') && event.shiftKey) {
        event.preventDefault();
        redo();
      }
    }
  };

  const name = getDesign().name;

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
                  label: 'preview [control .]',
                  onClick: () => setMode('preview'),
                },
                {
                  label: 'comments [control ;]',
                  onClick: () => setMode('comments'),
                },
                { label: 'help', onClick: () => setHelp(true) },
                { label: 'close', onClick: onClose },
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
                  size={name.length > 20 ? 'small' : undefined}
                >
                  {name}
                </Text>
                <FormDown color="control" />
              </Box>
            </Menu>
          </Box>
          <Box flex={false} direction="row" align="center">
            <Button
              title="undo last change"
              tip="undo last change [control z]"
              hoverIndicator
              icon={<Undo />}
              disabled={!undo}
              onClick={undo}
            />
            <Button
              title="redo last change"
              tip="redo last change [control shift z]"
              icon={<Redo />}
              hoverIndicator
              disabled={!redo}
              onClick={redo}
            />
            <Button
              title="add a component"
              tip="add a component [control a]"
              icon={<Add />}
              hoverIndicator
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
            <Box flex elevation="medium" pad="large" gap="medium">
              <Paragraph>
                Just checking, are you sure you want to delete
                <br />
                <Text weight="bold"> {name}</Text>?
              </Paragraph>
              <Footer justify="start">
                <Button
                  label="Yes, delete"
                  primary
                  onClick={() => {
                    localStorage.removeItem(`${name}--state`);
                    removeDesign();
                    onClose();
                  }}
                />
                <Button label="No, cancel" onClick={() => setDeleting(false)} />
              </Footer>
            </Box>
          </Layer>
        )}
        {sharing && <Sharing onClose={() => setSharing(false)} />}
        {adding && (
          <AddComponent onClose={() => setAdding(false)} property={property} />
        )}
        {editing && <DesignSettings onClose={() => setEditing(false)} />}
        {help && <Help onClose={() => setHelp(false)} />}
      </Box>
    </Keyboard>
  );
};

export default Header;
