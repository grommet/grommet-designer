import React, { Component } from 'react';
import {
  Box, Button, CheckBox, FormField, Heading, Layer, Select, Text, TextInput,
} from 'grommet';
import { Close, FormDown, FormNext, FormUp } from 'grommet-icons';
import { SelectLabel as IconLabel } from './Icon';
import ActionButton from './ActionButton';

const ColorLabel = ({ color }) => (
  <Box pad="small" direction="row" gap="small" align="center">
    <Box pad="small" background={color} />
    <Text weight="bold">{color}</Text>
  </Box>
);

const OptionLabel = ({ active, hasColor, name, value }) => {
  if (hasColor && typeof value === 'string') return <ColorLabel color={value} />;
  if (name === 'icon' && typeof value === 'string') return <IconLabel icon={value} />;
  return (
    <Box pad="small">
      <Text weight={active ? "bold" : undefined}>
        {typeof value !== 'string' ? JSON.stringify(value) : value || ''}
      </Text>
    </Box>
  );
};

export default class Property extends Component {

  state = {};

  render() {
    const { name, property, value, onChange } = this.props;
    const { expand, searchText } = this.state;
    const searchExp = searchText && new RegExp(searchText, 'i');
    if (Array.isArray(property)) {
      const hasColor = property.includes('light-1');
      return (
        <FormField key={name} name={name} label={name} style={{ margin: 0 }}>
          <Select
            options={searchExp ? [...property.filter(p => searchExp.test(p)), 'undefined']
              : [...property, 'undefined']}
            value={value || ''}
            valueLabel={
              <OptionLabel active name={name} hasColor={hasColor} value={value} />}
            onChange={({ option }) => {
              this.setState({ searchText: undefined });
              onChange(option === 'undefined' ? undefined : option);
            }}
            onSearch={property.length > 20 ? (searchText) => {
              this.setState({ searchText })
            } : undefined}
          >
            {(option) =>
              <OptionLabel
                name={name}
                hasColor={hasColor}
                value={option}
                active={option === value}
              />}
          </Select>
        </FormField>
      );
    } else if (typeof property === 'string') {
      return (
        <FormField key={name} name={name} label={name} style={{ margin: 0 }}>
          <TextInput
            value={value || ''}
            onChange={(event) => onChange(event.target.value)}
          />
        </FormField>
      );
    } else if (typeof property === 'boolean') {
      return (
        <FormField key={name} name={name} style={{ margin: 0 }}>
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
        <Box border="bottom">
          <Button hoverIndicator onClick={() => this.setState({ expand: !expand })}>
            <Box direction="row" align="center" justify="between" pad="small">
              <Text>{name}</Text>
              {expand
                ? <FormUp color={value ? 'brand' : undefined} />
                : <FormDown color={value ? 'brand' : undefined} />}
            </Box>
          </Button>
          {expand && Object.keys(property).map((key) => (
            <Property
              key={key}
              name={key}
              property={property[key]}
              value={(value || {})[key]}
              onChange={subValue => {
                let nextValue = { ...(value || {}) };
                if (subValue !== undefined && subValue !== '') nextValue[key] = subValue
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
        <Box border="bottom">
          <Button hoverIndicator onClick={() => this.setState({ expand: !expand })}>
            <Box direction="row" align="center" justify="between" pad="small">
              <Text>{name}</Text>
              <FormNext color={value ? 'brand' : undefined} />
            </Box>
          </Button>
          {expand && (
            <Layer
              position="right"
              margin="medium"
              onEsc={() => this.setState({ expand: false })}
              onClickOutside={() => this.setState({ expand: false })}
            >
              <Box
                direction="row"
                align="center"
                justify="between"
                gap="medium"
                pad="small"
              >
                <Heading margin={{ left: "small", vertical: 'none' }} level={3}>
                  {name}
                </Heading>
                <ActionButton
                  icon={<Close />}
                  onClick={() => this.setState({ expand: false })}
                />
              </Box>
              <Box pad={{ horizontal: 'medium', bottom: 'medium' }}>
                <CustomProperty {...this.props} />
              </Box>
            </Layer>
          )}
        </Box>
      );
    }
    return null;
  }
}
