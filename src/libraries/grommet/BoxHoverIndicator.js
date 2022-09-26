import React from 'react';
import { Box, Button, CheckBox, Tip } from 'grommet';
import BoxBackgroundImage from './BoxBackgroundImage';
import UndefinedOption, { undefinedOption } from './UndefinedOption';
import VariedOption, { variedOption } from './VariedOption';

const BoxHoverIndicator = (props) => {
  const { name, value, onChange } = props;
  // The extra Box fixes an issue with Tip not placing itself correctly
  // with CheckBox
  const content = [
    <Tip key="check" content={value !== true ? 'true' : 'false'}>
      <Box>
        <CheckBox
          name={name}
          checked={value === true}
          onChange={(event) => onChange(event.target.checked)}
        />
      </Box>
    </Tip>,
  ];
  if (value !== undefined) {
    content.push(
      <Button key="varied" onClick={() => onChange(variedOption.value)}>
        <VariedOption />
      </Button>,
    );
    content.push(
      <Button key="undefined" onClick={() => onChange(undefinedOption.value)}>
        <UndefinedOption />
      </Button>,
    );
  }
  return (
    <Box direction="row" align="center" pad={{ horizontal: 'small' }}>
      {content}
    </Box>
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
