import React from 'react';
import { Blank } from 'grommet-icons';
import InlineOptions from './InlineOptions';
import InlineOption from './InlineOption';
import UndefinedOption, { undefinedOption } from './UndefinedOption';
import VariedOption, { variedOption } from './VariedOption';

const options = ['xsmall', 'small', 'medium', 'large', 'xlarge', variedOption];

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

const PadState = ({ checked, name, option }) => {
  let content;
  if (name === 'pad') {
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
    <InlineOption checked={checked} label={option.label}>
      <Blank color={checked ? 'selected-text' : 'border'}>
        <g {...stroke}>{content}</g>
      </Blank>
    </InlineOption>
  );
};

const BoxPad = (props) => {
  const { name, value } = props;
  const adjustedOptions = options.filter(
    (o) => name === 'pad' || typeof o === 'string',
  );
  if (value) adjustedOptions.push(undefinedOption);
  return (
    <InlineOptions name={name} options={adjustedOptions} {...props}>
      {(option, { checked }) => {
        if (option.label === undefinedOption.label) {
          return <UndefinedOption checked={checked} />;
        } else if (option.label === variedOption.label) {
          return <VariedOption checked={checked} />;
        }
        return (
          <PadState
            name={name}
            option={option}
            checked={checked}
            {...props.props}
          />
        );
      }}
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
