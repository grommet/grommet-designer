import React from 'react';
import InlineOptions from './InlineOptions';
import EdgeSizeState from './EdgeSizeState';
import { undefinedOption } from './UndefinedOption';

export default ({ options, direction }) => {
  const EdgeSizeOptions = props => {
    const adjustedOptions = props.value
      ? options.concat(undefinedOption)
      : options;
    return (
      <InlineOptions name={props.name} options={adjustedOptions} {...props}>
        {(option, { checked, hover }) => (
          <EdgeSizeState
            {...props.props}
            size={option.label}
            checked={checked}
            hover={hover}
            direction={direction || props.props.direction}
          />
        )}
      </InlineOptions>
    );
  };

  EdgeSizeOptions.inline = true;

  return EdgeSizeOptions;
};
