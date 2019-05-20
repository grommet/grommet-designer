import React, { Component } from 'react';
import {
  Box, Button, CheckBox, Heading, Keyboard, Paragraph, Select, TextArea,
} from 'grommet';
import { CircleInformation, Duplicate, Trash } from 'grommet-icons';
import { types } from './Types';
import Property from './Property';
import { defaultComponent, getComponent, getParent } from './designs';

export default class Properties extends Component {

  state = {};

  textRef = React.createRef();

  setProp = (propName, option) => {
    const { design, selected, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    const component = getComponent(nextDesign, selected);
    if (option !== undefined) component.props[propName] = option
    else delete component.props[propName];
    onChange({ design: nextDesign });
  }

  setText = (text) => {
    const { design, selected, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    const component = getComponent(nextDesign, selected);
    component.text = text;
    onChange({ design: nextDesign });
  }

  link = (to) => {
    const { design, selected, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    const component = getComponent(nextDesign, selected);
    component.linkTo = to;
    onChange({ design: nextDesign });
  }

  setHide = (hide) => {
    const { design, selected, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    const component = getComponent(nextDesign, selected);
    component.hide = hide;
    onChange({ design: nextDesign });
  }

  duplicateComponent = (nextDesign, screen, id) => {
    const dupId = nextDesign[screen].components.length;
    const dup = { ...nextDesign[screen].components[id], id: dupId };
    nextDesign[screen].components[dupId] = dup;
    if (dup.children) {
      dup.children = dup.children
        .map(c => this.duplicateComponent(nextDesign, screen, c));
    }
    return dupId;
  }

  duplicate = () => {
    const { design, selected, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    const dupId = this.duplicateComponent(nextDesign, selected.screen, selected.component);
    const parent = getParent(nextDesign, selected);
    parent.children.push(dupId);
    onChange({ design: nextDesign });
  }

  onKeyDown = (event) => {
    const { onDelete } = this.props;
    if (event.metaKey) {
      // if (event.keyCode === 83) { // s
      //   event.preventDefault();
      //   this.textRef.current.focus();
      // }
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
      const screenComponents = design.screens[selected.screen].components;
      linkOptions = [
        ...Object.keys(screenComponents).map(k => screenComponents[k])
          .filter(c => c.type === 'Layer')
          .map(c => ({ screen: selected.screen, component: c.id })),
        ...Object.keys(design.screens).map(k => parseInt(k, 10))
          .filter(sId => sId !== selected.screen)
          .map(sId => ({ screen: sId, component: defaultComponent(design, sId) })),
        undefined
      ];
    }
    return (
      <Keyboard target="document" onKeyDown={this.onKeyDown}>
        <Box background="light-2" height="100vh">
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
              {type.text &&
                <TextArea
                  ref={this.textRef}
                  value={component.text || type.text}
                  onChange={event => this.setText(event.target.value)}
                />
              }
              {type.name === 'Button' && linkOptions.length > 1 && (
                <Box flex={false} margin={{ bottom: 'medium' }}>
                  <Select
                    placeholder="link to ..."
                    options={linkOptions}
                    value={component.linkTo || ''}
                    onChange={({ option }) => this.link(option || undefined)}
                    valueLabel={component.linkTo ? (
                        <Box pad="small">
                          {component.linkTo.screen === selected.screen
                            ? `Layer ${component.linkTo.component}`
                            : `Screen ${component.linkTo.screen}`}
                        </Box>
                      ) : undefined
                    }
                  >
                    {(option) => {
                      if (option) {
                        return (
                          <Box pad="small">
                            {option.screen === selected.screen
                              ? `Layer ${option.component}`
                              : `Screen ${option.screen}`}
                          </Box>
                        );
                      }
                      return <Box pad="small">clear</Box>;
                    }}
                  </Select>
                </Box>
              )}
              {type.name === 'Layer' && (
                <Box pad="small" background="dark-3">
                  <CheckBox
                    toggle
                    label="hide"
                    checked={!!component.hide}
                    onChange={() => this.setHide(!component.hide)}
                  />
                </Box>
              )}
              {type.properties &&
              Object.keys(type.properties).map((propName) => (
                <Property
                  key={propName}
                  name={propName}
                  property={type.properties[propName]}
                  value={component.props[propName]}
                  onChange={value => this.setProp(propName, value)}
                />
              ))}
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
