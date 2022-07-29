import React from 'react';
import { Box, CheckBox } from 'grommet';
import { FormClose } from 'grommet-icons';
import Field from '../components/Field';

const BooleanProperty = React.forwardRef(({ name, onChange, value }, ref) => (
  <Field key={name} label={name} htmlFor={name}>
    <Box
      pad={{ vertical: 'xsmall', horizontal: 'small' }}
      direction="row"
      gap="small"
    >
      <CheckBox
        ref={ref}
        id={name}
        name={name}
        checked={!!value}
        onChange={(event) => onChange(event.target.checked)}
      />
      {value === false && (
        <Box
          title="undefine"
          pad={{ horizontal: 'xxsmall' }}
          round="xsmall"
          hoverIndicator
          onClick={() => onChange(undefined)}
        >
          <FormClose />
        </Box>
      )}
    </Box>
  </Field>
));

export default BooleanProperty;
