import React, {
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
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

  // addOptions is what eventually gets passed to addComponent()
  const [addOptions, setAddOptions] = useState(
    // property
    (property?.onChange && { id: property.id, onChange: property.onChange }) ||
      // screen
      (!component && { within: selection }) ||
      undefined, // let AddLocation tell us
  );
  const [search, setSearch] = useState(selection ? '' : 'screen');
  const inputRef = useRef();

  const onChangeLocation = useCallback(
    (nextAddOptions) => setAddOptions(nextAddOptions),
    [],
  );

  useLayoutEffect(() => inputRef.current?.focus());

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
            <AddLocation onChange={onChangeLocation} />
          </Box>
        )}
        <Box flex overflow="auto">
          {selection && (
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
