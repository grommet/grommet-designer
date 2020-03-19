import React from 'react';
import { Blank } from 'grommet-icons';
import InlineOptions from './InlineOptions';
import InlineOption from './InlineOption';
import EdgeSizeState from './EdgeSizeState';

const options = [
  'xxsmall',
  'xsmall',
  'small',
  'medium',
  'large',
  'xlarge',
  { label: 'varied', value: {}, domValue: '{}' },
];

const stroke = {
  strokeWidth: 1,
  strokeLinecap: 'square',
};

const GridGap = props => {
  const { name, value } = props;
  const adjustedOptions = options.filter(
    o => name === 'gap' || typeof o === 'string',
  );
  if (value) {
    adjustedOptions.push({
      label: 'undefined',
      value: undefined,
      domValue: '-',
    });
  }
  return (
    <InlineOptions name={name} options={adjustedOptions} {...props}>
      {(option, { checked, hover }) => {
        let content;
        if (option.label === 'undefined') {
          content = [
            <line key="1" x1={8} y1={8} x2={16} y2={16} />,
            <line key="2" x1={8} y1={16} x2={16} y2={8} />,
          ];
        } else if (option.label === 'varied') {
          content = [
            <line key="1" x1={8} y1={2} x2={16} y2={2} />,
            <line key="2" x1={22} y1={8} x2={22} y2={16} />,
            <line key="3" x1={16} y1={22} x2={8} y2={22} />,
            <line key="4" x1={2} y1={16} x2={2} y2={8} />,
          ];
        }
        if (content) {
          return (
            <InlineOption checked={checked} hover={hover} label={option.label}>
              <Blank color={checked ? 'selected-text' : 'border'}>
                <g {...stroke}>{content}</g>
              </Blank>
            </InlineOption>
          );
        }
        return (
          <EdgeSizeState
            {...props.props}
            size={option.label}
            checked={checked}
            hover={hover}
            direction={name === 'row' ? 'column' : 'row'}
          />
        );
      }}
    </InlineOptions>
  );
};

GridGap.inline = true;

GridGap.dynamicProperty = ({ value }) => {
  if (typeof value === 'object') {
    return {
      row: GridGap,
      column: GridGap,
    };
  }
  return GridGap;
};

export default GridGap;
