import React from 'react';
import { Blank } from 'grommet-icons';

const ReorderIcon = () => (
  <Blank>
    <g strokeWidth={2} strokeLinecap="square">
      <path d="M 3,6 L 7,2 L 11,6 M 7,2 L 7,22" fill="none" stroke={2} />
      <path d="M 13,18 L 17,22 L 21,18 M 17,22 L 17,2" fill="none" stroke={2} />
    </g>
  </Blank>
);

export default ReorderIcon;
