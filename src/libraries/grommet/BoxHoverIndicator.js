import React from 'react';
import BoxBackgroundImage from './BoxBackgroundImage';
import InlineOptions from './InlineOptions';
import TrueOption, { trueOption } from './TrueOption';
import UndefinedOption, { undefinedOption } from './UndefinedOption';
import VariedOption, { variedOption } from './VariedOption';

const options = [trueOption, variedOption];

const BoxHoverIndicator = (props) => {
  const { name, value } = props;
  const adjustedOptions = [...options];
  if (value) adjustedOptions.push(undefinedOption);
  return (
    <InlineOptions name={name} options={adjustedOptions} {...props}>
      {(option, { checked, hover }) => {
        if (option.label === undefinedOption.label) {
          return <UndefinedOption checked={checked} hover={hover} />;
        } else if (option.label === variedOption.label) {
          return <VariedOption checked={checked} hover={hover} />;
        } else if (option.label === trueOption.label) {
          return <TrueOption checked={checked} hover={hover} />;
        }
        return null;
      }}
    </InlineOptions>
  );
};

BoxHoverIndicator.inline = true;

BoxHoverIndicator.dynamicProperty = ({ value }) => {
  if (typeof value === 'object') {
    return {
      color: ['-color-'],
      dark: false,
      opacity: ['weak', 'medium', 'strong'],
      image: BoxBackgroundImage,
    };
  }
  return BoxHoverIndicator;
};

export default BoxHoverIndicator;
