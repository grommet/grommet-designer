import React, { Component } from 'react';
import {
  Box, Button, CheckBox, FormField, Heading, Keyboard, Paragraph,
  Select, TextArea, TextInput,
} from 'grommet';
import { CircleInformation, Duplicate, Trash } from 'grommet-icons';
import { types } from './Types';
import Property from './Property';
import { getDisplayName, getLinkOptions, getParent } from './designs';

export default class Properties extends Component {

  state = {};

  textRef = React.createRef();

  componentDidUpdate(prevProps) {
    if (prevProps.component.id !== this.props.component.id
      && this.textRef.current) {
      this.textRef.current.select();
      this.textRef.current.focus();
    }
  }

  setProp = (propName, option) => {
    const { design, selected, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    const component = nextDesign.components[selected.component];
    if (option !== undefined) component.props[propName] = option
    else delete component.props[propName];
    onChange({ design: nextDesign });
  }

  setText = (text) => {
    const { design, selected, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    const component = nextDesign.components[selected.component];
    component.text = text;
    onChange({ design: nextDesign });
  }

  setName= (name) => {
    const { design, selected, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    const component = nextDesign.components[selected.component];
    component.name = name;
    onChange({ design: nextDesign });
  }

  link = (to) => {
    const { design, selected, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    const component = nextDesign.components[selected.component];
    component.linkTo = to;
    onChange({ design: nextDesign });
  }

  setHide = (hide) => {
    const { design, selected, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    const component = nextDesign.components[selected.component];
    component.hide = hide;
    onChange({ design: nextDesign });
  }

  duplicateComponent = (nextDesign, ids) => {
    const component = nextDesign.components[ids.component];
    const newId = nextDesign.nextId;
    nextDesign.nextId += 1;
    const newComponent = { ...component, id: newId };
    nextDesign.components[newId] = newComponent;
    if (newComponent.children) {
      newComponent.children = newComponent.children
        .map(c => this.duplicateComponent(nextDesign, { ...ids, component: c }));
    }
    return newId;
  }

  duplicate = () => {
    const { design, selected, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    const newId = this.duplicateComponent(nextDesign, selected);
    const parent = getParent(nextDesign, selected.component);
    parent.children.push(newId);
    onChange({ design: nextDesign, selected: { ...selected, component: newId } });
  }

  onKeyDown = (event) => {
    const { onDelete } = this.props;
    if (event.metaKey) {
      if (event.keyCode === 8) { // delete
        event.preventDefault();
        onDelete();
      }
    }
  }

  render() {
    const { component, design, selected, onDelete } = this.props;
    const { confirmDelete } = this.state;
    const type = types[component.type];
    let linkOptions;
    if (type.name === 'Button') {
      // options for what the button should do:
      // open a layer, close the layer it is in, change screens,
      linkOptions = getLinkOptions(design, selected);
    }
    return (
      <Keyboard target="document" onKeyDown={this.onKeyDown}>
        <Box background="dark-1" height="100vh" border="left">
          <Box flex={false}>
            <Heading level={2} size="small" margin={{ horizontal: 'small' }}>
              {component.name || type.name}
            </Heading>
          </Box>
          <Box flex overflow="auto">
            <Box flex={false}>
              {type.help && (
                <Box pad={{ horizontal: 'small' }}>
                  <Paragraph>{type.help}</Paragraph>
                </Box>
              )}
              <FormField label="name">
                <TextInput
                  ref={this.textRef}
                  value={component.name || ''}
                  onChange={event => this.setName(event.target.value)}
                />
              </FormField>
              {type.text &&
                <FormField label="text">
                  <TextArea
                    ref={this.textRef}
                    value={component.text || type.text}
                    onChange={event => this.setText(event.target.value)}
                  />
                </FormField>
              }
              {type.name === 'Button' && linkOptions.length > 1 && (
                <FormField label="link to">
                  <Select
                    options={linkOptions}
                    value={component.linkTo || ''}
                    onChange={({ option }) =>
                      this.link(option ? option : undefined)}
                    valueLabel={component.linkTo ? (
                      <Box pad="small">
                        {getDisplayName(design, component.linkTo)}
                      </Box>
                    ) : undefined}
                  >
                    {(option) => (
                      <Box pad="small">
                        {option ? getDisplayName(design, option) : 'clear'}
                      </Box>
                    )}
                  </Select>
                </FormField>
              )}
              {type.name === 'Layer' && (
                <FormField>
                  <Box pad="small">
                    <CheckBox
                      toggle
                      label="hide"
                      reverse
                      checked={!!component.hide}
                      onChange={() => this.setHide(!component.hide)}
                    />
                  </Box>
                </FormField>
              )}
              {type.properties && (
                <Box>
                  <Heading level={3} size="small" margin="small">
                    Properties
                  </Heading>
                  {Array.isArray(type.properties) ? (
                    type.properties.map(({ label, properties }) => (
                      <Box key={label} flex={false}>
                        <Heading level={4} size="small" margin="small">{label}</Heading>
                        {Object.keys(properties).map((propName) => (
                          <Property
                            key={propName}
                            design={design}
                            selected={selected}
                            name={propName}
                            property={properties[propName]}
                            value={component.props[propName]}
                            onChange={value => this.setProp(propName, value)}
                          />
                        ))}
                      </Box>
                    ))
                  ) :
                    Object.keys(type.properties).map((propName) => (
                      <Property
                        key={propName}
                        design={design}
                        selected={selected}
                        name={propName}
                        property={type.properties[propName]}
                        value={component.props[propName]}
                        onChange={value => this.setProp(propName, value)}
                      />
                    ))
                  }
                </Box>
              )}
            </Box>
          </Box>
          {type.name !== 'Grommet' &&
            <Box flex={false} direction="row" align="center" justify="between">
              <Button
                title="duplicate"
                icon={<Duplicate />}
                hoverIndicator
                onClick={() => this.duplicate()}
              />
              <Button
                title="documentation"
                icon={<CircleInformation />}
                hoverIndicator
                target="_blank"
                href={`https://v2.grommet.io/${type.name.toLowerCase()}`}
              />
              {confirmDelete && (
                <Button
                  title="confirm delete"
                  icon={<Trash color="status-critical" />}
                  hoverIndicator
                  onClick={() => {
                    this.setState({ confirmDelete: false });
                    onDelete();
                  }}
                />
              )}
              <Button
                title="delete"
                icon={<Trash />}
                hoverIndicator
                onClick={() => this.setState({ confirmDelete: !confirmDelete })}
              />
            </Box>
          }
        </Box>
      </Keyboard>
    );
  }
}
