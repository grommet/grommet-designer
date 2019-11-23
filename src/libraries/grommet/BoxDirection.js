import React from 'react';
import InlineOptions from './InlineOptions';
import LayoutState from './LayoutState';

const options = ['column', 'row', 'row-responsive'];

const BoxDirection = ({ props, ...rest }) => {
  const { align, justify } = props;
  return (
    <InlineOptions name="direction" options={options} {...rest}>
      {(option, { checked, hover }) => (
        <LayoutState
          align={align}
          axis="main"
          direction={option}
          justify={justify}
          label={option}
          checked={checked}
          hover={hover}
        />
      )}
    </InlineOptions>
  );
};

BoxDirection.inline = true;

export default BoxDirection;
