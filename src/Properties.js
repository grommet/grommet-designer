import React, { Component } from 'react';
import {
  Anchor, Box, Button, CheckBox, FormField, Heading, Select,
  Text, TextArea, TextInput,
} from 'grommet';
import { Trash } from 'grommet-icons';
import { componentTypes } from './Types';
import { SelectLabel as IconLabel } from './Icon';

const ColorLabel = ({ color }) => (
  <Box pad="small" direction="row" gap="small" align="center">
    <Box pad="small" background={color} />
    <Text>{color}</Text>
  </Box>
);

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
              value={component.text}
              onChange={event => onSetText(event.target.value)}
            />
          }
          <Box flex="grow">
            {componentType.properties &&
            Object.keys(componentType.properties).map((propName) => {
              const property = componentType.properties[propName];
              if (Array.isArray(property)) {
                const isColor = property.includes('light-1');
                const isIcon = componentType.name === 'Icon';
                return (
                  <FormField key={propName} name={propName} label={propName}>
                    <Select
                      options={[...property, 'undefined']}
                      value={component.props[propName] || ''}
                      valueLabel={isColor && component.props[propName] ? (
                        <ColorLabel color={component.props[propName]} />
                      ) : (isIcon ? (
                        <IconLabel icon={component.props[propName]} />
                      ) : undefined)}
                      onChange={({ option }) =>
                        onSetProp(propName, option === 'undefined' ? undefined : option)}
                    >
                      {isColor
                        ? (option) => <ColorLabel color={option} />
                        : (isIcon ? (option) => <IconLabel icon={option} /> : null)}
                    </Select>
                  </FormField>
                );
              } else if (typeof property === 'string') {
                return (
                  <FormField key={propName} name={propName} label={propName}>
                    <TextInput
                      value={component.props[propName] || ''}
                      onChange={(event) => onSetProp(propName, event.target.value)}
                    />
                  </FormField>
                );
              } else if (typeof property === 'boolean') {
                return (
                  <FormField key={propName} name={propName}>
                    <Box pad="small">
                      <CheckBox
                        label={propName}
                        toggle
                        checked={!!component.props[propName]}
                        onChange={(event) => onSetProp(propName, event.target.checked)}
                      />
                    </Box>
                  </FormField>
                );
              }
              return null;
            })}
          </Box>
          {componentType.name !== 'Grommet' &&
            <Box flex={false} margin={{ top: 'medium' }}>
              <Button
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
