import React from 'react';
import { Box, Button, FormField, Heading, Layer, Select, TextInput } from 'grommet';
import { Close } from 'grommet-icons';

export default ({ design, themes, onChange, onClose }) => (
  <Layer position="center" onEsc={onClose} onClickOutside={onClose}>
    <Box pad="medium">
      <Box
        direction="row"
        align="center"
        justify="between"
        gap="medium"
        width="medium"
      >
        <Heading level={2} margin="none">
          Design
        </Heading>
        <Button icon={<Close />} hoverIndicator onClick={onClose} />
      </Box>
      <FormField label="Name" name="name">
        <TextInput
          value={design.name || ''}
          onChange={(event) => {
            const nextDesign = JSON.parse(JSON.stringify(design));
            nextDesign.name = event.target.value;
            onChange({ design: nextDesign });
          }}
        />
      </FormField>
      <FormField label="Theme" name="theme">
        <Select
          options={[...themes, 'undefined']}
          value={design.theme || ''}
          onChange={({ option }) => {
            const nextDesign = JSON.parse(JSON.stringify(design));
            nextDesign.theme = option === 'undefined' ? undefined : option;
            onChange({ design: nextDesign });
          }}
        />
      </FormField>
    </Box>
  </Layer>
);
