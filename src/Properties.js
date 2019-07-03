import React, { Component } from 'react';
import {
  Box, CheckBox, Heading, Keyboard, Paragraph,
  Select, TextArea, TextInput,
} from 'grommet';
import { CircleInformation, Duplicate, Trash } from 'grommet-icons';
import { types } from './types';
import Property from './Property';
import {
  duplicateComponent, getDisplayName, getLinkOptions, getParent,
} from './design';
import ActionButton from './components/ActionButton';
import Field from './components/Field';

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

  setProp = (propName, value) => {
    const { design, selected, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    const component = nextDesign.components[selected.component];
    if (value !== undefined) component.props[propName] = value
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

  duplicate = () => {
    const { design, selected, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    const newId = duplicateComponent(nextDesign, selected.component);
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
        <Box background="dark-2" height="100vh" border="left">
          <Box flex={false} border="bottom">
            <Heading level={2} size="small" margin={{ horizontal: 'medium' }}>
              {component.name || type.name}
            </Heading>
          </Box>
          <Box flex overflow="auto">
            <Box flex="grow">
              <Box>
                {type.help && <Paragraph>{type.help}</Paragraph>}
                {type.name !== 'Reference' && (
                  <Field label="name">
                    <TextInput
                      ref={this.textRef}
                      plain
                      name="name"
                      value={component.name || ''}
                      onChange={event => this.setName(event.target.value)}
                      style={{ textAlign: 'end' }}
                    />
                  </Field>
                )}
                {type.text &&
                  <Field label="text">
                    <TextArea
                      ref={this.textRef}
                      plain
                      value={component.text || type.text}
                      onChange={event => this.setText(event.target.value)}
                    />
                  </Field>
                }
                {type.name === 'Button' && linkOptions.length > 1 && (
                  <Field label="link to">
                    <Select
                      name="linkTo"
                      plain
                      options={linkOptions}
                      value={component.linkTo || ''}
                      onChange={({ option }) =>
                        this.link(option ? option : undefined)}
                      valueLabel={component.linkTo ? (
                        <Box pad="small">
                          {getDisplayName(design, component.linkTo.component)}
                        </Box>
                      ) : undefined}
                    >
                      {(option) => (
                        <Box pad="small">
                          {option ? getDisplayName(design, option.component) : 'clear'}
                        </Box>
                      )}
                    </Select>
                  </Field>
                )}
                {type.name === 'Layer' && (
                  <Field label="hide">
                    <Box pad="small">
                      <CheckBox
                        toggle
                        checked={!!component.hide}
                        onChange={() => this.setHide(!component.hide)}
                      />
                    </Box>
                  </Field>
                )}
              </Box>
              {type.properties && (
                <Box flex="grow">
                  <Heading
                    level={3}
                    size="small"
                    margin={{ horizontal: 'medium', vertical: 'small' }}
                  >
                    Properties
                  </Heading>
                  {Array.isArray(type.properties) ? (
                    type.properties.map(({ label, properties }) => (
                      <Box key={label} flex={false} margin={{ top: 'small' }}>
                        <Heading
                          level={4}
                          size="small"
                          margin={{ horizontal: 'medium', vertical: 'small' }}
                        >
                          {label}
                        </Heading>
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
                  <Box flex />
                  <Field label="style">
                    <TextArea
                      name="style"
                      rows={2}
                      plain
                      value={component.props.styling
                        || (component.props.style
                          && JSON.stringify(component.props.style, null, 2))
                        || ''}
                      onChange={(event) => {
                        this.setProp('styling', event.target.value);
                        try {
                          const json = JSON.parse(event.target.value);
                          this.setProp('style', json);
                        } catch (e) {
                          // console.log('!!! catch');
                        }
                      }}
                    />
                  </Field>
                </Box>
              )}
            </Box>
          </Box>
          {type.name !== 'Grommet' &&
            <Box
              flex={false}
              direction="row"
              align="center"
              justify="between"
              pad="small"
              border="top"
            >
              <ActionButton
                title="duplicate"
                icon={<Duplicate />}
                onClick={() => this.duplicate()}
              />
              <ActionButton
                title="documentation"
                icon={<CircleInformation />}
                target="_blank"
                href={`https://v2.grommet.io/${type.name.toLowerCase()}`}
              />
              {confirmDelete && (
                <ActionButton
                  title="confirm delete"
                  icon={<Trash color="status-critical" />}
                  onClick={() => {
                    this.setState({ confirmDelete: false });
                    onDelete();
                  }}
                />
              )}
              <ActionButton
                title="delete"
                icon={<Trash />}
                onClick={() => this.setState({ confirmDelete: !confirmDelete })}
              />
            </Box>
          }
        </Box>
      </Keyboard>
    );
  }
}
