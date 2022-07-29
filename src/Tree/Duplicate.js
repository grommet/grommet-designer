import React, { useRef } from 'react';
import ReactGA from 'react-ga';
import {
  Box,
  Button,
  Form,
  FormField,
  Footer,
  Header,
  Heading,
  Layer,
  TextInput,
} from 'grommet';
import { Close } from 'grommet-icons';
import { getDesign, load, useDesigns } from '../design2';

const Duplicate = ({ onClose }) => {
  const designs = useDesigns(); // just local to check for duplicate name
  const nameRef = useRef();

  // useEffect(() => nameRef.current.focus(), []);

  return (
    <Layer
      position="top-left"
      margin="medium"
      animation="fadeIn"
      onEsc={onClose}
      onClickOutside={onClose}
    >
      <Box flex elevation="medium" pad="medium">
        <Header>
          <Heading level={2} size="small" margin="none">
            duplicate
          </Heading>
          <Button
            tip="cancel duplicate"
            icon={<Close />}
            hoverIndicator
            onClick={onClose}
          />
        </Header>
        <Form
          validate="change"
          onSubmit={({ value }) => {
            const design = JSON.parse(JSON.stringify(getDesign()));
            design.name = value.name;
            delete design.readonly; // in case this was fetched
            load({ design });
            ReactGA.event({ category: 'switch', action: 'duplicate design' });
            onClose();
          }}
        >
          <FormField
            label="name"
            htmlFor="name"
            name="name"
            required
            validate={(name) =>
              designs.find(({ name: n, local }) => local && n === name)
                ? 'existing'
                : undefined
            }
          >
            <TextInput ref={nameRef} id="name" name="name" />
          </FormField>
          <Footer margin={{ top: 'medium' }}>
            <Button label="duplicate" type="submit" primary />
          </Footer>
        </Form>
      </Box>
    </Layer>
  );
};

export default Duplicate;
