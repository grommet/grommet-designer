import React, { Component } from 'react';
import {
  Box, CheckBox, FormField, Select, Text, TextInput,
} from 'grommet';
import { componentTypes } from './Types';
import { SelectLabel as IconLabel } from './Icon';

const ColorLabel = ({ color }) => (
  <Box pad="small" direction="row" gap="small" align="center">
    <Box pad="small" background={color} />
    <Text weight="bold">{color}</Text>
  </Box>
);

export default class Properties extends Component {

  state = {};

  render() {
    const { component, onSetProp, propName } = this.props;
    const { searchText } = this.state;
    const componentType = componentTypes[component.componentType];
    const property = componentType.properties[propName];
    const searchExp = searchText && new RegExp(searchText, 'i');
    if (Array.isArray(property)) {
      const isColor = property.includes('light-1');
      const isIcon = componentType.name === 'Icon' && propName === 'icon';
      return (
        <FormField key={propName} name={propName} label={propName}>
          <Select
            options={searchExp ? property.filter(p => searchExp.test(p)) : [...property, 'undefined']}
            value={component.props[propName] || ''}
            valueLabel={isColor && component.props[propName] ? (
              <ColorLabel color={component.props[propName]} />
            ) : (isIcon ? (
              <IconLabel icon={component.props[propName]} />
            ) : undefined)}
            onChange={({ option }) => {
              this.setState({ searchText: undefined });
              onSetProp(propName, option === 'undefined' ? undefined : option);
            }}
            onSearch={property.length > 20 ? (searchText) => {
              this.setState({ searchText })
            } : undefined}
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
  }
}
