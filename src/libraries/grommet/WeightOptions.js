import React from 'react';
import InlineOptions from './InlineOptions';
import WeightState from './WeightState';

export default ({ options }) => {
  const WeightOptions = props => {
    const adjustedOptions = props.value ? options.concat('undefined') : options;
    return (
      <InlineOptions name={props.name} options={adjustedOptions} {...props}>
        {(option, { checked, hover }) => {
          return (
            <WeightState
              {...props.props}
              weight={option}
              checked={checked}
              hover={hover}
            />
          );
        }}
      </InlineOptions>
    );
  };

  WeightOptions.inline = true;

  return WeightOptions;
};
