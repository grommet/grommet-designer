import React from 'react';
import InlineOptions from './InlineOptions';
import LayoutState from './LayoutState';

const options = ['start', 'center', 'end', 'between'];

const BoxJustify = ({ props, ...rest }) => {
  const { align, direction } = props;
  return (
    <InlineOptions name="justify" options={options} {...rest}>
      {(option, { checked, hover }) => (
        <LayoutState
          align={align}
          axis="main"
          direction={direction}
          justify={option.value}
          label={option.value}
          checked={checked}
          hover={hover}
        />
      )}
    </InlineOptions>
  );
};

BoxJustify.inline = true;

export default BoxJustify;
