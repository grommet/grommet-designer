import React, { Component } from 'react';
import {
  Anchor, Box, Button, Heading, Select, TextArea,
} from 'grommet';
import { Trash } from 'grommet-icons';
import { types } from './Types';
import Property from './Property';

export default class Properties extends Component {

  ref = React.createRef();

  // getSnapshotBeforeUpdate(prevProps, prevState) {
  //   // Capture the scroll position so we can preserve scroll later.
  //   const container = this.ref.current;
  //   return container.scrollTop;
  // }

  // componentDidUpdate(prevProps, prevState, scrollTop) {
  //   if (scrollTop) {
  //     const container = this.ref.current;
  //     container.scrollTop = scrollTop;
  //   }
  // }

  setProp = (propName, option) => {
    const { design, screen, id, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    const component = nextDesign[screen].components[id];
    component.props[propName] = option;
    onChange({ design: nextDesign });
  }

  setText = (text) => {
    const { design, screen, id, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    nextDesign[screen].components[id].text = text;
    onChange({ design: nextDesign });
  }

  link = (screenId) => {
    const { design, screen, id, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    nextDesign[screen].components[id].linkTo = screenId;
    onChange({ design: nextDesign });
  }

  render() {
    const { component, design } = this.props;
    const type = types[component.type];
    return (
      <Box background="light-2" overflow="auto">
        <Box ref={this.ref} flex="grow">
          <Heading level={2} size="small" margin={{ horizontal: 'small' }}>
            {component.name || type.name}
          </Heading>
          {type.text &&
            <TextArea
              value={component.text || type.text}
              onChange={event => this.setText(event.target.value)}
            />
          }
          {type.name === 'Button' && (
            <Box flex={false} margin={{ bottom: 'medium' }}>
              <Select
                placeholder="link to ..."
                options={[...design.filter(s => s).map(s => s.id), undefined]}
                value={component.linkTo || ''}
                onChange={({ option }) => this.link(option || undefined)}
                valueLabel={component.linkTo
                  ? <Box pad="small">{`Screen ${component.linkTo}`}</Box>
                  : undefined
                }
              >
                {(screenId) => {
                  if (screenId) {
                    return <Box pad="small">{`Screen ${screenId}`}</Box>
                  }
                  return <Box pad="small">clear</Box>;
                }}
              </Select>
            </Box>
          )}
          <Box flex="grow">
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
          {type.name !== 'Grommet' &&
            <Box flex={false} margin={{ top: 'medium' }}>
              <Button
                title="delete"
                icon={<Trash />}
                hoverIndicator
                onClick={() => this.delete()}
              />
              <Box pad="small">
                <Anchor
                  href={`https://v2.grommet.io/${type.name.toLowerCase()}`}
                  label='docs'
                />
              </Box>
            </Box>
          }
        </Box>
      </Box>
    );
  }
}
