import React from 'react';
import InlineOptions from './InlineOptions';
import EdgeSizeState from './EdgeSizeState';

export default ({ options, direction }) => {
  const EdgeSizeOptions = props => {
    const adjustedOptions = props.value
      ? options.concat({ label: 'undefined', value: undefined, domValue: '-' })
      : options;
    return (
      <InlineOptions name={props.name} options={adjustedOptions} {...props}>
        {(option, { checked, hover }) => (
          <EdgeSizeState
            size={option.label}
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
