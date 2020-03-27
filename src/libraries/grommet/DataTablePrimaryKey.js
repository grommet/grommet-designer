import React from 'react';
import { Text } from 'grommet';
import InlineOptions from './InlineOptions';
import InlineOption from './InlineOption';
import UndefinedOption, { undefinedOption } from './UndefinedOption';

const options = [{ label: 'false', value: false, domValue: '--' }];

const PrimaryKey = props => {
  const { value } = props;
  const adjustedOptions = [...options];
  if (value === false) adjustedOptions.push(undefinedOption);
  return (
    <InlineOptions name={props.name} options={adjustedOptions} {...props}>
      {(option, { checked, hover }) => {
        if (option.label === undefinedOption.label) {
          return <UndefinedOption checked={checked} hover={hover} />;
        }
        return (
          <InlineOption checked={checked} hover={hover} label="false">
            <Text color="text-xweak"> ! </Text>
          </InlineOption>
        );
      }}
    </InlineOptions>
  );
};

PrimaryKey.inline = true;

export default PrimaryKey;
