import React from 'react';
import { Button } from 'grommet';
import { Previous } from 'grommet-icons';

const BackButton = ({ onClick, title }) => (
  <Button
    icon={<Previous />}
    hoverIndicator
    tip={{
      content: title,
      dropProps: { align: { left: 'right' } },
    }}
    onClick={onClick}
  />
);

export default BackButton;
