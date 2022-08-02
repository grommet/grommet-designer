import React from 'react';
import { Blank } from 'grommet-icons';
import InlineOption from './InlineOption';

const contentCoords = ({ align, direction, justify }) => {
  if (direction === 'row' || direction === 'row-responsive') {
    let x;
    let y;
    if (justify === 'start' || !justify) x = [3, 10];
    else if (justify === 'center') x = [9, 15];
    else if (justify === 'end') x = [14, 21];
    else if (justify === 'between') x = [3, 21];
    else x = [3, 3];
    if (align === 'stretch' || !align) y = [3, 21];
    else if (align === 'start') y = [3, 11];
    else if (align === 'center') y = [8, 17];
    else if (align === 'end') y = [13, 21];
    else if (align === 'baseline')
      return [
        [x[0], 10, x[0], 12],
        [x[1], 7, x[1], 12],
      ];
    else y = [3, 3];
    return [
      [x[0], y[0], x[0], y[1]],
      [x[1], y[0], x[1], y[1]],
    ];
  } else {
    let x;
    let y;
    if (justify === 'start' || !justify) y = [4, 10];
    else if (justify === 'center') y = [9, 15];
    else if (justify === 'end') y = [14, 20];
    else if (justify === 'between') y = [4, 20];
    else y = [4, 4];
    if (align === 'stretch' || !align) x = [4, 20];
    else if (align === 'start' || align === 'baseline') x = [4, 11];
    else if (align === 'center') x = [8, 17];
    else if (align === 'end') x = [13, 20];
    else x = [4, 4];
    return [
      [x[0], y[0], x[1], y[0]],
      [x[0], y[1], x[1], y[1]],
    ];
  }
};

const edgeCoords = ({ axis, direction = 'column' }) => {
  if (
    (direction === 'row' && axis === 'cross') ||
    (direction === 'column' && axis === 'main')
  ) {
    return [
      [0, 0, 24, 0],
      [0, 24, 24, 24],
    ];
  } else {
    return [
      [0, 0, 0, 24],
      [24, 0, 24, 24],
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

const Line = ({ coords }) => (
  <line
    x1={coords[0]}
    y1={coords[1]}
    x2={coords[2]}
    y2={coords[3]}
    stroke="#000"
    strokeWidth="5"
    strokeLinecap="square"
  />
);

const LayoutState = ({ align, axis, checked, direction, justify, label }) => {
  const c = contentCoords({ align, direction, justify });
  const e = edgeCoords({ axis, direction });
  return (
    <InlineOption label={label}>
      <Blank color={checked ? 'selected-text' : 'border'}>
        <Edge coords={e[0]} />
        <Edge coords={e[1]} />
        <Line coords={c[0]} />
        <Line coords={c[1]} />
      </Blank>
    </InlineOption>
  );
};

export default LayoutState;
