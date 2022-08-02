import React from 'react';
import { useComponent } from '../../design2';
import InlineOptions from './InlineOptions';
import LayoutState from './LayoutState';

const options = ['stretch', 'start', 'center', 'end', 'baseline'];

const BoxAlign = ({ id, ...rest }) => {
  const component = useComponent(id);
  const { direction, justify } = component.props;
  return (
    <InlineOptions name="align" options={options} {...rest}>
      {(option, { checked }) => (
        <LayoutState
          align={option.value}
          axis="cross"
          direction={direction}
          justify={justify}
          label={option.label}
          checked={checked}
        />
      )}
    </InlineOptions>
  );
};

BoxAlign.inline = true;

export default BoxAlign;
