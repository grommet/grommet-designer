import React, { Component } from 'react';
import {
  Box, Button, CheckBox, Heading, Layer, Select, Text, TextInput,
} from 'grommet';
import { Close, FormDown, FormNext, FormUp } from 'grommet-icons';
import { SelectLabel as IconLabel } from './Icon';
import ActionButton from './ActionButton';
import Field from './components/Field';

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
        <Field key={name} label={name}>
          <Select
            plain
            name={name}
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
        </Field>
      );
    } else if (typeof property === 'string') {
      return (
        <Field key={name} label={name}>
          <TextInput
            name={name}
            plain
            value={value || ''}
            onChange={(event) => onChange(event.target.value)}
          />
        </Field>
      );
    } else if (typeof property === 'boolean') {
      return (
        <Field key={name} label={name}>
          <Box pad="small">
            <CheckBox
              name={name}
              toggle
              checked={!!value}
              onChange={(event) => onChange(event.target.checked)}
            />
          </Box>
        </Field>
      );
    } else if (typeof property === 'object') {
      return (
        <Box key={name}>
          <Button hoverIndicator onClick={() => this.setState({ expand: !expand })}>
            <Field label={name}>
              <Box pad="small">
                {expand
                  ? <FormUp color={value ? 'accent-2' : undefined} />
                  : <FormDown color={value ? 'accent-2' : undefined} />}
              </Box>
            </Field>
          </Button>
          {expand && (
            <Box margin={{ left: 'small' }} background="dark-1">
              {Object.keys(property).map((key) => (
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
          )}
        </Box>
      );
    } else if (typeof property === 'function') {
      const CustomProperty = property;
      return (
        <Box key={name} border="bottom">
          <Button hoverIndicator onClick={() => this.setState({ expand: !expand })}>
            <Field label={name}>
              <Box pad="small">
                <FormNext color={value ? 'accent-2' : undefined} />
              </Box>
            </Field>
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
