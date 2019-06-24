import React from 'react';
import { Button, Paragraph } from 'grommet';
import Action from './Action';

const ConfirmReset = ({ onCancel, onReset }) => (
  <Action onClose={onCancel}>
    <Paragraph>
      Are you sure you want to discard the changes you've
      made to your design since it was last saved and reset
      to a fresh design?
    </Paragraph>
    <Button label="Yes, reset" onClick={onReset} />
  </Action>
);

export default ConfirmReset;
