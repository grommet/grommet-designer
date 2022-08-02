import React from 'react';
import InlineOptions from './InlineOptions';
import SizeState from './SizeState';
import { undefinedOption } from './UndefinedOption';

const SizeOptions = ({ options }) => {
  const SizeOptions = (props) => {
    const adjustedOptions = props.value
      ? options.concat(undefinedOption)
      : options;
    return (
      <InlineOptions name={props.name} options={adjustedOptions} {...props}>
        {(option, { checked }) => {
          return (
            <SizeState {...props.props} size={option.value} checked={checked} />
          );
        }}
      </InlineOptions>
    );
  };

  SizeOptions.inline = true;

  return SizeOptions;
};

export default SizeOptions;
