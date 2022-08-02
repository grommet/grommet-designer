import React from 'react';
import { useComponent } from '../../design2';
import InlineOptions from './InlineOptions';
import LayoutState from './LayoutState';

const options = ['start', 'center', 'end', 'between'];

const BoxJustify = ({ id, ...rest }) => {
  const component = useComponent(id);
  const { align, direction } = component.props;
  return (
    <InlineOptions name="justify" options={options} {...rest}>
      {(option, { checked }) => (
        <LayoutState
          align={align}
          axis="main"
          direction={direction}
          justify={option.value}
          label={option.value}
          checked={checked}
        />
      )}
    </InlineOptions>
  );
};

BoxJustify.inline = true;

export default BoxJustify;
