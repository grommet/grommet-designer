import React from 'react';
import { Blank } from 'grommet-icons';
import InlineOption from './InlineOption';

const stroke = {
  strokeWidth: 1,
  strokeLinecap: 'square',
};

export const undefinedOption = {
  label: 'undefined',
  value: undefined,
  domValue: '-',
};

const UndefinedOption = ({ checked, hover }) => (
  <InlineOption checked={checked} hover={hover} label={undefinedOption.label}>
    <Blank color={checked ? 'selected-text' : 'border'}>
      <g {...stroke}>
        <line key="1" x1={8} y1={8} x2={16} y2={16} />
        <line key="2" x1={8} y1={16} x2={16} y2={8} />
      </g>
    </Blank>
  </InlineOption>
);

export default UndefinedOption;
