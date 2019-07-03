import React from 'react';
import { FormField, Keyboard, TextInput } from 'grommet';
import Action from '../components/Action';

const Rename = ({ design, onClose, onChange }) => {
  const ref = React.useRef();

  React.useLayoutEffect(() => {
    setTimeout(() => {
      if (ref.current) ref.current.focus();
    }, 1);
  });

  return (
    <Action onClose={onClose}>
      <Keyboard target="document" onEnter={onClose}>
        <FormField label="Name" name="name">
          <TextInput
            ref={ref}
            value={design.name || ''}
            onChange={(event) => {
              const name = event.target.value;
              const nextDesign = JSON.parse(JSON.stringify(design));
              nextDesign.name = name;
              onChange({ design: nextDesign });
            }}
          />
        </FormField>
      </Keyboard>
    </Action>
  );
};

export default Rename;
