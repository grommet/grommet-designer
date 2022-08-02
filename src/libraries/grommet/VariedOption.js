import React from 'react';
import { Blank } from 'grommet-icons';
import InlineOption from './InlineOption';

const stroke = {
  strokeWidth: 1,
  strokeLinecap: 'square',
};

export const variedOption = { label: 'varied', value: {}, domValue: '{}' };

const VariedOption = ({ checked }) => (
  <InlineOption checked={checked} label={variedOption.label}>
    <Blank color={checked ? 'selected-text' : 'border'}>
      <g {...stroke}>
        <line key="1" x1={8} y1={2} x2={16} y2={2} />
        <line key="2" x1={22} y1={8} x2={22} y2={16} />
        <line key="3" x1={16} y1={22} x2={8} y2={22} />
        <line key="4" x1={2} y1={16} x2={2} y2={8} />
      </g>
    </Blank>
  </InlineOption>
);

export default VariedOption;
