import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Footer,
  Form,
  FormField,
  RadioButtonGroup,
} from 'grommet';
import { duplicateComponent } from './design2';
import SelectionContext from './SelectionContext';
import blankPage from './templates/blankPage';
import dashboard from './templates/dashboard';
import details from './templates/details';
import list from './templates/list';
import table from './templates/table';

const templates = {
  dashboard,
  details,
  'empty page': blankPage,
  list,
  table,
};

const NewScreen = ({ onClose }) => {
  const [selection, setSelection, { setLocation }] =
    useContext(SelectionContext);
  const [value, setValue] = useState({
    template: 'empty page',
  });

  return (
    <Box fill direction="row" justify="center">
      <Box
        pad="large"
        height={{ min: '100vh' }}
        width={{ max: 'large' }}
        gap="medium"
      >
        <Form
          value={value}
          onChange={setValue}
          onSubmit={() => {
            const template = templates[value.template];
            const id = duplicateComponent(
              template.screens[template.screenOrder[0]].root,
              { within: selection, template },
            );
            setLocation({ screen: selection });
            setSelection(id);
          }}
        >
          <FormField label="Select screen template" name="template">
            <RadioButtonGroup
              name="template"
              options={[
                'empty page',
                'dashboard',
                'list',
                'table',
                'details',
                'wizard',
              ]}
            />
          </FormField>
          <Footer margin={{ top: 'medium' }}>
            <Button
              title="select screen template"
              type="submit"
              primary
              disabled={!templates[value.template]}
              label="Select"
            />
          </Footer>
        </Form>
      </Box>
    </Box>
  );
};

export default NewScreen;
