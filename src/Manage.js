import React, { Component } from 'react';
import {
  Box, Button, Form, FormField, Heading, Layer,
} from 'grommet';
import { Close, Save, Trash } from 'grommet-icons';

export default class Manage extends Component {

  state = { designs: [] };

  componentDidMount() {
    let item = localStorage.getItem('designs'); // array of names
    if (item) {
      const designs = JSON.parse(item);
      this.setState({ designs });
    }
  }

  onSelect = (name) => {
    const { onChange } = this.props;
    const item = localStorage.getItem(name);
    if (item) {
      const design = JSON.parse(item);
      onChange(design);
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
    this.setState({ designs: nextDesigns, name: undefined });
  }

  onDelete = (name) => {
    const { designs } = this.state;
    const nextDesigns = designs.filter(n => n !== name);
    localStorage.setItem('designs', JSON.stringify(nextDesigns));
    localStorage.removeItem(name);
    this.setState({ designs: nextDesigns });
  }

  render() {
    const { onClose } = this.props;
    const { designs } = this.state;
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
          <Form onSubmit={this.onSave}>
            <FormField
              name="name"
              label="Give your current design a name"
              required
            />
            <Button title="save" type="submit" icon={<Save />} />
          </Form>
        </Box>
        
        <Box flex overflow="auto" pad="medium">
          {designs.map(name => (
            <Box
              key={name}
              direction="row"
              align="center"
              justify="between"
            >
              <Box flex="grow">
                <Button
                  hoverIndicator
                  onClick={() => this.onSelect(name)}
                >
                  <Box pad="small">{name}</Box>
                </Button>
              </Box>
              <Button
                icon={<Trash />}
                hoverIndicator
                onClick={() => this.onDelete(name)}
              />
            </Box>
          ))}
        </Box>
      </Layer>
    );
  }
}
