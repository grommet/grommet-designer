import React, { Component } from 'react';
import {
  Box, CheckBox, FormField, Select, Text, TextInput,
} from 'grommet';
import { SelectLabel as IconLabel } from './Icon';

const ColorLabel = ({ color }) => (
  <Box pad="small" direction="row" gap="small" align="center">
    <Box pad="small" background={color} />
    <Text weight="bold">{color}</Text>
  </Box>
);

export default class Property extends Component {

  state = {};

  render() {
    const { name, property, value, onChange } = this.props;
    const { expand, searchText } = this.state;
    const searchExp = searchText && new RegExp(searchText, 'i');
    if (Array.isArray(property)) {
      const isColor = property.includes('light-1');
      const isIcon = name === 'icon';
      return (
        <FormField key={name} name={name} label={name}>
          <Select
            options={searchExp ? [...property.filter(p => searchExp.test(p)), 'undefined']
              : [...property, 'undefined']}
            value={value || ''}
            valueLabel={isColor && value ? (
              <ColorLabel color={value} />
            ) : (isIcon && value ? (
              <IconLabel icon={value} />
            ) : undefined)}
            onChange={({ option }) => {
              this.setState({ searchText: undefined });
              onChange(option === 'undefined' ? undefined : option);
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
        <FormField key={name} name={name} label={name}>
          <TextInput
            value={value || ''}
            onChange={(event) => onChange(event.target.value)}
          />
        </FormField>
      );
    } else if (typeof property === 'boolean') {
      return (
        <FormField key={name} name={name}>
          <Box pad="small">
            <CheckBox
              label={name}
              toggle
              checked={!!value}
              onChange={(event) => onChange(event.target.checked)}
            />
          </Box>
        </FormField>
      );
    } else if (typeof property === 'object') {
      return (
        <Box border="bottom" margin={{ bottom: 'small' }}>
          <Box direction="row" pad="small">
            <CheckBox
              label={name}
              reverse
              checked={expand || false}
              onChange={() => this.setState({ expand: !expand })}
            />
          </Box>
          {expand && Object.keys(property).map((key) => (
            <Property
              key={key}
              name={key}
              property={property[key]}
              value={(value || {})[key]}
              onChange={subValue =>
                onChange({ ...(value || {}), [key]: subValue })}
            />
          ))}
        </Box>
      );
    }
    return null;
  }
}
