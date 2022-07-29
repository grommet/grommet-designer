import React from 'react';
import InlineOptions from './InlineOptions';
import EdgeSizeState from './EdgeSizeState';
import { undefinedOption } from './UndefinedOption';

const EdgeSizeOptions = ({ options, direction }) => {
  const EdgeSizeOptions = (props) => {
    const adjustedOptions = props.value
      ? options.concat(undefinedOption)
      : options;
    return (
      <InlineOptions name={props.name} options={adjustedOptions} {...props}>
        {(option, { checked, hover }) => (
          <EdgeSizeState
            {...props}
            size={option.label}
            checked={checked}
            hover={hover}
            direction={direction || props.direction}
          />
        )}
      </InlineOptions>
    );
  };

  EdgeSizeOptions.inline = true;

  return EdgeSizeOptions;
};

export default EdgeSizeOptions;
