import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Header as GrommetHeader,
  Keyboard,
  Menu,
  Text,
} from 'grommet';
import { Add, FormDown, Redo, Undo } from 'grommet-icons';
import { useChanges, useDesignSummary } from '../design2';
import AddComponent from './AddComponent';
import ConfirmDelete from './ConfirmDelete';
import Duplicate from './Duplicate';
import DesignSettings from './DesignSettings';
import Help from './Help';
import Export from './Export';
import Publish from './Publish';
import GenerateCode from './GenerateCode';

const within = (node, container) => {
  if (!node) return false;
  if (node === container) return true;
  return within(node.parentNode, container);
};

const Header = ({ onClose, property, setMode }) => {
  const [adding, setAdding] = useState();
  const [editing, setEditing] = useState();
  const [publishing, setPublishing] = useState();
  const [exporting, setExporting] = useState();
  const [generatingCode, setGeneratingCode] = useState();
  const [deleting, setDeleting] = useState();
  const [duplicating, setDuplicating] = useState();
  const [help, setHelp] = useState();
  const { undo, redo } = useChanges();
  const { name } = useDesignSummary();
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

  return (
    <Keyboard target="document" onKeyDown={onKey}>
      <Box ref={ref} flex={false} border="bottom">
        <GrommetHeader border="bottom" gap="none">
          <Box flex>
            <Menu
              a11yTitle="Open design menu"
              hoverIndicator
              dropProps={{ align: { top: 'bottom' } }}
              items={[
                { label: 'configure', onClick: () => setEditing(true) },
                {
                  label: 'preview [control .]',
                  onClick: () => setMode('preview'),
                },
                // {
                //   label: 'comments [control ;]',
                //   onClick: () => setMode('comments'),
                // },
                { label: 'publish', onClick: () => setPublishing(true) },
                { label: 'export', onClick: () => setExporting(true) },
                { label: 'duplicate', onClick: () => setDuplicating(true) },
                {
                  label: 'generate code',
                  onClick: () => setGeneratingCode(true),
                },
                { label: 'help', onClick: () => setHelp(true) },
                { label: 'close', onClick: onClose },
                { label: 'delete', onClick: () => setDeleting(true) },
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
          <ConfirmDelete onClose={() => setDeleting(false)} onDone={onClose} />
        )}
        {duplicating && <Duplicate onClose={() => setDuplicating(false)} />}
        {publishing && <Publish onClose={() => setPublishing(false)} />}
        {exporting && <Export onClose={() => setExporting(false)} />}
        {adding && (
          <AddComponent onClose={() => setAdding(false)} property={property} />
        )}
        {editing && <DesignSettings onClose={() => setEditing(false)} />}
        {generatingCode && (
          <GenerateCode onClose={() => setGeneratingCode(false)} />
        )}
        {help && <Help onClose={() => setHelp(false)} />}
      </Box>
    </Keyboard>
  );
};

export default Header;
