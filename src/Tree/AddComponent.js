import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Heading, Layer, TextInput } from 'grommet';
import { Close } from 'grommet-icons';
import SelectionContext from '../SelectionContext';
import { useComponent } from '../design2';
import AddLibraries from './AddLibraries';
import AddLocation from './AddLocation';
import AddTemplates from './AddTemplates';

const AddComponent = ({ onClose, property }) => {
  const [selection] = useContext(SelectionContext);
  const component = useComponent(selection);
  const onlyScreen = !selection && !property;
  const [addLocation, setAddLocation] = useState();

  // addOptions is what eventually gets passed to addComponent()
  const addOptions = useMemo(() => {
    // property
    if (property?.onChange)
      return { id: property.id, onChange: property.onChange };
    // screen
    if (!component) return { within: selection };
    // component
    if (addLocation) return { [addLocation]: selection };
    return {};
  }, [property, component, addLocation, selection]);
  const [search, setSearch] = useState(onlyScreen ? 'screen' : '');
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
    return undefined;
  }, [addOptions]);

  const searchExp = search ? new RegExp(search, 'i') : undefined;

  return (
    <Layer
      position="top-left"
      animation={false}
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
            <AddLocation value={addLocation} onChange={setAddLocation} />
          </Box>
        )}
        <Box flex overflow="auto">
          {!onlyScreen && (
            <Box flex={false} pad="small">
              <TextInput
                ref={inputRef}
                placeholder="search ..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </Box>
          )}

          <AddLibraries
            addOptions={addOptions}
            onClose={onClose}
            property={property}
            searchExp={searchExp}
          />

          <AddTemplates
            addOptions={addOptions}
            onClose={onClose}
            property={property}
            searchExp={searchExp}
          />
        </Box>
      </Box>
    </Layer>
  );
};

export default AddComponent;
