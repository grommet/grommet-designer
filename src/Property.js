import React, { Component } from 'react';
import {
  Box, Button, CheckBox, FormField, Heading, Layer, Select, Text, TextInput,
} from 'grommet';
import { Close, Edit, FormDown, FormUp } from 'grommet-icons';
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
              reverse
              checked={!!value}
              onChange={(event) => onChange(event.target.checked)}
            />
          </Box>
        </FormField>
      );
    } else if (typeof property === 'object') {
      return (
        <Box border="bottom" margin={{ bottom: 'small' }}>
          <Box direction="row" align="center" justify="between" pad={{ left: "small" }}>
            <Text>{name}</Text>
            <Button
              icon={expand ? <FormUp /> : <FormDown />}
              hoverIndicator
              onClick={() => this.setState({ expand: !expand })}
            />
          </Box>
          {expand && Object.keys(property).map((key) => (
            <Property
              key={key}
              name={key}
              property={property[key]}
              value={(value || {})[key]}
              onChange={subValue => {
                let nextValue = { ...(value || {}) };
                if (subValue !== undefined) nextValue[key] = subValue
                else delete nextValue[key];
                onChange(Object.keys(nextValue).length > 0 ? nextValue : undefined);
              }}
            />
          ))}
        </Box>
      );
    } else if (typeof property === 'function') {
      const CustomProperty = property;
      return (
        <Box border="bottom" margin={{ bottom: 'small' }}>
          <Box direction="row" align="center" justify="between" pad={{ left: "small" }}>
            <Text>{name}</Text>
            <Button
              icon={<Edit />}
              hoverIndicator
              onClick={() => this.setState({ expand: !expand })}
            />
          </Box>
          {expand && (
            <Layer
              position="top"
              onEsc={() => this.setState({ expand: false })}
            >
              <Box direction="row" align="center" justify="between" gap="medium">
                <Heading margin={{ left: "small", vertical: "none" }} level={3}>{name}</Heading>
                <Button
                  icon={<Close />}
                  hoverIndicator
                  onClick={() => this.setState({ expand: false })}
                />
              </Box>
              <CustomProperty {...this.props} />
            </Layer>
          )}
        </Box>
      );
    }
    return null;
  }
}
