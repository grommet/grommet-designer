import React from 'react';
import InlineOptions from './InlineOptions';
import SizeState from './SizeState';
import { undefinedOption } from './UndefinedOption';

export default ({ options }) => {
  const SizeOptions = props => {
    const adjustedOptions = props.value
      ? options.concat(undefinedOption)
      : options;
    return (
      <InlineOptions name={props.name} options={adjustedOptions} {...props}>
        {(option, { checked, hover }) => {
          return (
            <SizeState
              {...props.props}
              size={option.value}
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
