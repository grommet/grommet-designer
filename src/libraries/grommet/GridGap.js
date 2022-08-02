import React from 'react';
import InlineOptions from './InlineOptions';
import UndefinedOption, { undefinedOption } from './UndefinedOption';
import VariedOption, { variedOption } from './VariedOption';
import EdgeSizeState from './EdgeSizeState';

const options = [
  'xxsmall',
  'xsmall',
  'small',
  'medium',
  'large',
  'xlarge',
  variedOption,
];

const GridGap = (props) => {
  const { name, value } = props;
  const adjustedOptions = options.filter(
    (o) => name === 'gap' || typeof o === 'string',
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
          <EdgeSizeState
            {...props.props}
            size={option.label}
            checked={checked}
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
