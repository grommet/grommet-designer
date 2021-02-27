import React from 'react';
import { Blank } from 'grommet-icons';
import InlineOption from './InlineOption';

const stroke = {
  strokeWidth: 1,
  strokeLinecap: 'square',
};

export const trueOption = { label: 'true', value: true, domValue: 'true' };

const TrueOption = ({ checked, hover }) => (
  <InlineOption checked={checked} hover={hover} label={trueOption.label}>
    <Blank color={checked ? 'selected-text' : 'border'}>
      <g {...stroke}>
        <line x1={2} y1={2} x2={22} y2={2} />
        <line x1={22} y1={2} x2={22} y2={22} />
        <line x1={22} y1={22} x2={2} y2={22} />
        <line x1={2} y1={22} x2={2} y2={2} />
      </g>
      {checked && (
        <g strokeWidth={2} strokeLinecap="round">
          <line x1={7} y1={12} x2={12} y2={17} />
          <line x1={12} y1={17} x2={17} y2={7} />
        </g>
      )}
    </Blank>
  </InlineOption>
);

export default TrueOption;
