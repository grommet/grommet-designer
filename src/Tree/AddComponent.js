import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import { Box, Button, Heading, Layer, TextInput } from 'grommet';
import { Close } from 'grommet-icons';
import SelectionContext from '../SelectionContext';
import { useComponent } from '../design2';
import AddLibraries from './AddLibraries';
import AddLocation from './AddLocation';
import AddTemplates from './AddTemplates';

const AddComponent = ({ onClose }) => {
  const [selection] = useContext(SelectionContext);
  const component = useComponent(selection);
  const [addLocation, setAddLocation] = useState('within');
  const [search, setSearch] = useState('');
  const inputRef = useRef();

  useLayoutEffect(() => inputRef.current?.focus());

  const searchExp = search ? new RegExp(search, 'i') : undefined;

  return (
    <Layer
      position="top-left"
      margin="medium"
      full="vertical"
      onEsc={onClose}
      onClickOutside={onClose}
    >
      <Box flex elevation="medium">
        <Box flex={false} direction="row" justify="between" align="center">
          <Button
            title="close"
            tip="close"
            icon={<Close />}
            onClick={onClose}
          />
          <Heading
            level={2}
            size="small"
            margin={{ vertical: 'none', horizontal: 'small' }}
          >
            add
          </Heading>
        </Box>
        {component && (
          <Box flex={false} pad="small">
            <AddLocation
              onChange={(nextAddLocation) => setAddLocation(nextAddLocation)}
            />
          </Box>
        )}
        <Box flex overflow="auto">
          <Box flex={false} pad="small">
            <TextInput
              ref={inputRef}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </Box>

          <AddLibraries
            addLocation={addLocation}
            onClose={onClose}
            searchExp={searchExp}
          />

          <AddTemplates
            addLocation={addLocation}
            onClose={onClose}
            searchExp={searchExp}
          />
        </Box>
      </Box>
    </Layer>
  );
};

export default AddComponent;
