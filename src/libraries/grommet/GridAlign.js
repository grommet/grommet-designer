import React from 'react';
import InlineOptions from './InlineOptions';
import LayoutState from './LayoutState';

const options = ['stretch', 'start', 'center', 'end'];

const GridAlign = ({ props, ...rest }) => {
  const { justify } = props;
  return (
    <InlineOptions name="align" options={options} {...rest}>
      {(option, { checked, hover }) => (
        <LayoutState
          align={option.value}
          axis="cross"
          direction="column"
          justify={justify}
          label={option.label}
          checked={checked}
          hover={hover}
        />
      )}
    </InlineOptions>
  );
};

GridAlign.inline = true;

export default GridAlign;
