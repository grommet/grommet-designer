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

  render() {
    const { component, design, onDelete, onLink, onSetProp, onSetText } = this.props;
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
              onChange={event => onSetText(event.target.value)}
            />
          }
          {type.name === 'Button' && (
            <Box flex={false} margin={{ bottom: 'medium' }}>
              <Select
                placeholder="link to ..."
                options={[...design.filter(s => s).map(s => s.id), undefined]}
                value={component.linkTo || ''}
                onChange={({ option }) => onLink(option)}
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
                onChange={value => onSetProp(propName, value)}
              />
            ))}
          </Box>
          {type.name !== 'Grommet' &&
            <Box flex={false} margin={{ top: 'medium' }}>
              <Button
                title="delete"
                icon={<Trash />}
                hoverIndicator
                onClick={() => onDelete()}
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
