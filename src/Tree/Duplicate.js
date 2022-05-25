import React, { useEffect, useRef, useState } from 'react';
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
import { getDesign, load } from '../design2';

const Duplicate = ({ onClose }) => {
  const [designs, setDesigns] = useState([]);
  const nameRef = useRef();

  useEffect(() => {
    let stored = localStorage.getItem('designs');
    if (stored) setDesigns(JSON.parse(stored));
  }, []);

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
            onClose();
          }}
        >
          <FormField
            label="name"
            htmlFor="name"
            name="name"
            required
            validate={(name) =>
              designs.find((n) => n === name) ? 'existing' : undefined
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
