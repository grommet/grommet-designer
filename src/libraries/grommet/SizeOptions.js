import React from 'react';
import InlineOptions from './InlineOptions';
import SizeState from './SizeState';

export default ({ options }) => {
  const SizeOptions = props => {
    const adjustedOptions = props.value ? options.concat('undefined') : options;
    return (
      <InlineOptions name={props.name} options={adjustedOptions} {...props}>
        {(option, { checked, hover }) => {
          return (
            <SizeState
              {...props.props}
              size={option}
              checked={checked}
              hover={hover}
            />
          );
        }}
      </InlineOptions>
    );
  };

  SizeOptions.inline = true;

  return SizeOptions;
};
