import React from 'react';
import InlineOptions from './InlineOptions';
import EdgeSizeState from './EdgeSizeState';

export default ({ options, direction }) => {
  const EdgeSizeOptions = props => {
    const adjustedOption = props.value ? options.concat('undefined') : options;
    return (
      <InlineOptions name="gap" options={adjustedOption} {...props}>
        {(option, { checked, hover }) => (
          <EdgeSizeState
            size={option}
            checked={checked}
            hover={hover}
            {...props.props}
            direction={direction || props.props.direction}
          />
        )}
      </InlineOptions>
    );
  };

  EdgeSizeOptions.inline = true;

  return EdgeSizeOptions;
};
