import React from 'react';
import {
  Box, Button, CheckBox, FormField, Heading, Select, TextArea, TextInput,
} from 'grommet';
import { Trash } from 'grommet-icons';
import { componentTypes } from './Types';

export default (props) => {
  const { component, onDelete, onSetProp, onSetText } = props;
  const componentType = componentTypes[component.componentType];
  return (
    <Box background="light-2" overflow="auto">
      <Box flex={false}>
        <Heading level={2} size="small" margin={{ horizontal: 'small' }}>
          {component.name || componentType.name}
        </Heading>
        {componentType.text &&
          <TextArea
            value={component.text}
            onChange={event => onSetText(event.target.value)}
          />
        }
        {componentType.properties &&
        Object.keys(componentType.properties).map((propName) => {
          const property = componentType.properties[propName];
          if (Array.isArray(property)) {
            return (
              <FormField key={propName} name={propName} label={propName}>
                <Select
                  options={property}
                  value={component.props[propName] || ''}
                  onChange={({ option }) => onSetProp(propName, option)}
                />
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
        {componentType.name !== 'Grommet' &&
          <Box margin={{ vertical: 'medium' }}>
            <Button
              icon={<Trash />}
              hoverIndicator
              onClick={() => onDelete()}
            />
          </Box>
        }
      </Box>
    </Box>
  );
}
