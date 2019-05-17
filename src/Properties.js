import React, { Component } from 'react';
import {
  Anchor, Box, Button, Heading, TextArea,
} from 'grommet';
import { Trash } from 'grommet-icons';
import { componentTypes } from './Types';
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
    const { component, onDelete, onSetProp, onSetText } = this.props;
    const componentType = componentTypes[component.componentType];
    return (
      <Box background="light-2" overflow="auto">
        <Box ref={this.ref} flex="grow">
          <Heading level={2} size="small" margin={{ horizontal: 'small' }}>
            {component.name || componentType.name}
          </Heading>
          {componentType.text &&
            <TextArea
              value={component.text || componentType.text}
              onChange={event => onSetText(event.target.value)}
            />
          }
          <Box flex="grow">
            {componentType.properties &&
            Object.keys(componentType.properties).map((propName) => (
              <Property
                key={propName}
                name={propName}
                property={componentType.properties[propName]}
                value={component.props[propName]}
                onChange={value => onSetProp(propName, value)}
              />
            ))}
          </Box>
          {componentType.name !== 'Grommet' &&
            <Box flex={false} margin={{ top: 'medium' }}>
              <Button
                title="delete"
                icon={<Trash />}
                hoverIndicator
                onClick={() => onDelete()}
              />
              <Box pad="small">
                <Anchor
                  href={`https://v2.grommet.io/${componentType.name.toLowerCase()}`}
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
