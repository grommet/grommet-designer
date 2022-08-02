import React from 'react';
import { useComponent } from '../../design2';
import InlineOptions from './InlineOptions';
import LayoutState from './LayoutState';

const options = ['column', 'row', 'row-responsive'];

const BoxDirection = ({ id, ...rest }) => {
  const component = useComponent(id);
  const { align, justify } = component.props;
  return (
    <InlineOptions name="direction" options={options} {...rest}>
      {(option, { checked }) => (
        <LayoutState
          align={align}
          axis="main"
          direction={option.value}
          justify={justify}
          label={option.label}
          checked={checked}
        />
      )}
    </InlineOptions>
  );
};

BoxDirection.inline = true;

export default BoxDirection;
