import React, { Component } from 'react';
import {
  Box, Button, Form, FormField, Heading, Layer, Paragraph, Stack, Text,
} from 'grommet';
import { Close, Save, Trash, Upload } from 'grommet-icons';
import { upgradeDesign } from './designs';

export default class Manage extends Component {

  state = { designs: [], name: '' };

  componentDidMount() {
    let item = localStorage.getItem('designs'); // array of names
    if (item) {
      const designs = JSON.parse(item);
      this.setState({ designs });
    }
  }

  onSelect = (name) => {
    const { onChange, onClose } = this.props;
    const item = localStorage.getItem(name);
    if (item) {
      const design = JSON.parse(item);
      upgradeDesign(design);
      onChange(design);
      onClose();
    }
  }

  onSave = (event) => {
    event.preventDefault();
    const { design } = this.props;
    const { designs } = this.state;
    const { value: { name } } = event;
    const nextDesign = { ...design, name, date: (new Date()).toISOString() };
    localStorage.setItem(name, JSON.stringify(nextDesign));
    const nextDesigns = [...designs];
    if (!nextDesigns.includes(name)) nextDesigns.push(name);
    localStorage.setItem('designs', JSON.stringify(nextDesigns));
    this.setState({ designs: nextDesigns, name: '', message: `saved ${name}` });
  }

  onDelete = (name) => {
    const { designs } = this.state;
    const nextDesigns = designs.filter(n => n !== name);
    localStorage.setItem('designs', JSON.stringify(nextDesigns));
    localStorage.removeItem(name);
    this.setState({ designs: nextDesigns });
  }

  render() {
    const { design, onChange, onClose } = this.props;
    const { designs, name, message } = this.state;
    return (
      <Layer onEsc={onClose}>
        <Box
          direction="row"
          gap="medium"
          align="center"
          justify="between"
          pad="medium"
        >
          <Heading level={2} margin={{ left: 'small', vertical: 'none'}}>
            Designs
          </Heading>
          <Button icon={<Close />} hoverIndicator onClick={onClose} />
        </Box>
        <Box pad={{ horizontal: "medium" }}>
          <Form value={{ name: name || design.name }} onSubmit={this.onSave}>
            <FormField
              name="name"
              label="Save your current design with this name"
              required
            />
            <Box direction="row" gap="medium" align="center">
              <Button title="save" type="submit" icon={<Save />}  hoverIndicator />
              {message && <Text>{message}</Text>}
            </Box>
          </Form>
        </Box>
        
        <Box flex overflow="auto" pad="medium">
          {designs.length > 0 && (
            <Paragraph margin="small">
              Or, discard your current design and load one you've saved previously
            </Paragraph>
          )}
          {designs.map(designName => (
            <Box
              key={designName}
              direction="row"
              align="center"
              justify="between"
            >
              <Box flex="grow">
                <Button
                  hoverIndicator
                  onClick={() => this.onSelect(designName)}
                >
                  <Box pad="small">{designName}</Box>
                </Button>
              </Box>
              <Button
                icon={<Trash />}
                hoverIndicator
                onClick={() => this.onDelete(designName)}
              />
            </Box>
          ))}
        </Box>
        <Box basis="xxsmall">
          <Stack fill guidingChild="last" interactiveChild="first">
            <input
              style={{ display: 'block', width: '100%', height: '100%' }}
              type="file"
              onChange={(event) => {
                const reader = new FileReader();
                reader.onload = () => {
                  try {
                    const design = JSON.parse(reader.result);
                    onChange(design);
                    onClose();
                  } catch {
                    // this.setState({ });
                  }
                };
                reader.readAsText(event.target.files[0]);
              }}
            />
            <Box
              height="xxsmall"
              background="light-2"
              align="center"
              justify="center"
            >
              <Upload />
            </Box>
          </Stack>
        </Box>
      </Layer>
    );
  }
}
