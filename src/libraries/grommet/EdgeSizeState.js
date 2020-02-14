import React from 'react';
import { Blank } from 'grommet-icons';
import InlineOption from './InlineOption';

const edgeCoords = ({ direction = 'column', size }) => {
  let b;
  if (size === 'xxsmall') b = [10, 14];
  else if (size === 'xsmall') b = [9, 15];
  else if (size === 'small') b = [8, 16];
  else if (size === 'medium') b = [7, 17];
  else if (size === 'large') b = [6, 18];
  else if (size === 'xlarge') b = [4, 20];
  else if (size === 'xxlarge') b = [1, 23];
  else
    return [
      [8, 8, 16, 16],
      [8, 16, 16, 8],
    ];
  if (direction === 'row') {
    return [
      [b[0], 0, b[0], 24],
      [b[1], 0, b[1], 24],
    ];
  } else {
    return [
      [0, b[0], 24, b[0]],
      [0, b[1], 24, b[1]],
    ];
  }
};

const Edge = ({ coords }) => (
  <line
    x1={coords[0]}
    y1={coords[1]}
    x2={coords[2]}
    y2={coords[3]}
    stroke="#000"
    strokeWidth="1"
    strokeLinecap="square"
  />
);

const EdgeSizeState = ({ checked, direction, hover, size }) => {
  const e = edgeCoords({ direction, size });
  return (
    <InlineOption checked={checked} hover={hover} label={size}>
      <Blank color={checked ? 'selected-text' : 'border'}>
        <Edge coords={e[0]} />
        <Edge coords={e[1]} />
      </Blank>
    </InlineOption>
  );
};

export default EdgeSizeState;
