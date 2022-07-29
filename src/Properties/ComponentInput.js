import React, { useCallback, useContext } from 'react';
import { Box, Button } from 'grommet';
import { Add, Close, Edit } from 'grommet-icons';
import { getComponent, removeComponent } from '../design2';
import SelectionContext from '../SelectionContext';

const ComponentInput = ({ id, htmlId, name, onChange, value }) => {
  const [, setSelection, { setLocation }] = useContext(SelectionContext);

  const onChangeAndSet = useCallback(
    (nextValue) => {
      onChange(nextValue);
      // update location so Tree knows about the new value to start with
      setLocation({ property: { id, value: nextValue, onChangeAndSet } });
    },
    [id, onChange, setLocation],
  );

  if (value && typeof value === 'string') return null;
  // if we have a value ensure we have a component there. if not, clear it
  if (value && !getComponent(value)) onChange(undefined);

  return (
    <Box direction="row">
      {value ? (
        <>
          <Button
            id={htmlId}
            aria-label={`Edit ${name}`}
            icon={<Edit />}
            onClick={() => {
              setLocation({
                property: { id, value, onChange: onChangeAndSet },
              });
              setSelection(value);
            }}
          />
          <Button
            icon={<Close />}
            onClick={() => {
              onChange(undefined);
              removeComponent(value);
            }}
          />
        </>
      ) : (
        <Button
          id={htmlId}
          aria-label={`Add ${name}`}
          icon={<Add />}
          onClick={() => {
            setLocation({ property: { id, onChange: onChangeAndSet } });
            setSelection(value);
          }}
        />
      )}
    </Box>
  );
};

export default ComponentInput;
