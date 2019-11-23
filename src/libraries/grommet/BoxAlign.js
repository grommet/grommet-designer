import React from 'react';
import InlineOptions from './InlineOptions';
import LayoutState from './LayoutState';

const options = ['stretch', 'start', 'center', 'end', 'baseline'];

const BoxAlign = ({ props, ...rest }) => {
  const { direction, justify } = props;
  return (
    <InlineOptions name="align" options={options} {...rest}>
      {(option, { checked, hover }) => (
        <LayoutState
          align={option}
          axis="cross"
          direction={direction}
          justify={justify}
          label={option}
          checked={checked}
          hover={hover}
        />
      )}
    </InlineOptions>
  );
};

BoxAlign.inline = true;

export default BoxAlign;
