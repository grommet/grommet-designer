import React from 'react';
import { Blank } from 'grommet-icons';
import InlineOptions from './InlineOptions';
import InlineOption from './InlineOption';

const options = [
  'xsmall',
  'small',
  'medium',
  'large',
  'xlarge',
  { label: 'varied', value: {}, domValue: '{}' },
];

const deltas = {
  xsmall: 1,
  small: 2,
  medium: 3,
  large: 4,
  xlarge: 6,
};

const stroke = {
  strokeWidth: 1,
  strokeLinecap: 'square',
};

const PadState = ({ checked, hover, name, option }) => {
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
  } else if (name === 'pad') {
    const d = deltas[option.value];
    const d2 = 24 - d;
    content = (
      <path
        fillRule="evenodd"
        d={`M 0 0 H 24 V 24 H 0 Z
      M ${d} ${d} V ${d2} H ${d2} V ${d} Z`}
      />
    );
  } else if (name === 'horizontal') {
    const d = deltas[option.value];
    content = [
      <rect key="1" x={0} y={0} width={d} height={24} />,
      <rect key="2" x={24 - d} y={0} width={d} height={24} />,
    ];
  } else if (name === 'vertical') {
    const d = deltas[option.value];
    content = [
      <rect key="1" x={0} y={0} width={24} height={d} />,
      <rect key="2" x={0} y={24 - d} width={24} height={d} />,
    ];
  } else if (name === 'top') {
    const d = deltas[option.value];
    content = <rect x={0} y={0} width={24} height={d} />;
  } else if (name === 'bottom') {
    const d = deltas[option.value];
    content = <rect x={0} y={24 - d} width={24} height={d} />;
  } else if (name === 'left') {
    const d = deltas[option.value];
    content = <rect x={0} y={0} width={d} height={24} />;
  } else if (name === 'right') {
    const d = deltas[option.value];
    content = <rect x={24 - d} y={0} width={d} height={24} />;
  }

  return (
    <InlineOption checked={checked} hover={hover} label={option.label}>
      <Blank color={checked ? 'white' : 'dark-4'}>
        <g {...stroke}>{content}</g>
      </Blank>
    </InlineOption>
  );
};

const BoxPad = props => {
  const { name, value } = props;
  const adjustedOptions = options.filter(
    o => name === 'pad' || typeof o === 'string',
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
      {(option, { checked, hover }) => (
        <PadState
          name={name}
          option={option}
          checked={checked}
          hover={hover}
          {...props.props}
        />
      )}
    </InlineOptions>
  );
};

BoxPad.inline = true;

BoxPad.dynamicProperty = ({ value }) => {
  if (typeof value === 'object') {
    return {
      horizontal: BoxPad,
      vertical: BoxPad,
      top: BoxPad,
      bottom: BoxPad,
      left: BoxPad,
      right: BoxPad,
    };
  }
  return BoxPad;
};

export default BoxPad;
