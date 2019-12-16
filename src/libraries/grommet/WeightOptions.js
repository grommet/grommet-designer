import React from 'react';
import InlineOptions from './InlineOptions';
import WeightState from './WeightState';

export default ({ options }) => {
  const WeightOptions = props => {
    const adjustedOptions = props.value
      ? options.concat({ label: 'undefined', value: undefined, domValue: '-' })
      : options;
    return (
      <InlineOptions name={props.name} options={adjustedOptions} {...props}>
        {(option, { checked, hover }) => {
          return (
            <WeightState
              {...props.props}
              weight={option.value}
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
