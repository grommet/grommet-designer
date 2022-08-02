import React from 'react';
import InlineOptions from './InlineOptions';
import WeightState from './WeightState';
import { undefinedOption } from './UndefinedOption';

const WeightOption = ({ options }) => {
  const WeightOptions = (props) => {
    const adjustedOptions = props.value
      ? options.concat(undefinedOption)
      : options;
    return (
      <InlineOptions name={props.name} options={adjustedOptions} {...props}>
        {(option, { checked }) => {
          return (
            <WeightState
              {...props.props}
              weight={option.value}
              checked={checked}
            />
          );
        }}
      </InlineOptions>
    );
  };

  WeightOptions.inline = true;

  return WeightOptions;
};

export default WeightOption;
