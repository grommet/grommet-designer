import React, { useContext } from 'react';
import { Box, Grid, Select, Text } from 'grommet';
import DesignContext from '../DesignContext';

const specialNames = {
  '-any-': '<any option>',
  '-none-': '<no option>',
};

const LinkOptionsProperty = ({ componentId, linkOptions, value, onChange }) => {
  const { design } = useContext(DesignContext);
  const [searchText, setSearchText] = React.useState('');
  const searchExp = React.useMemo(
    () => searchText && new RegExp(`${searchText}`, 'i'),
    [searchText],
  );
  let selectOptions = linkOptions;
  if (searchExp) {
    selectOptions = linkOptions.filter((o) => searchExp.test(o.label || o));
  }

  const LinkLabel = ({ selected, value }) => (
    <Box pad="small">
      <Text weight={selected ? 'bold' : undefined}>
        {(value === 'undefined' && 'undefined') || (value && value.label)}&nbsp;
      </Text>
    </Box>
  );

  const names = [
    ...Object.keys(specialNames),
    ...design.components[componentId].props.options,
  ];

  return (
    <Grid
      gap="small"
      columns={['1/2', '1/2']}
      align="center"
      margin={{ horizontal: 'medium' }}
    >
      {names.map((name) => [
        <Text key="name" textAlign="end">
          {specialNames[name] || name}
        </Text>,
        <Select
          key="value"
          options={[...selectOptions, 'undefined']}
          value={(value && value[name]) || ''}
          onChange={({ option }) => {
            const nextValue =
              (value && JSON.parse(JSON.stringify(value))) || {};
            if (option === 'undefined') delete nextValue[name];
            else nextValue[name] = option;
            onChange(nextValue);
          }}
          onSearch={
            linkOptions.length > 10 || searchExp
              ? (nextSearchText) => setSearchText(nextSearchText)
              : undefined
          }
          valueLabel={<LinkLabel selected value={value && value[name]} />}
        >
          {(option) => (
            <LinkLabel
              selected={
                value &&
                value[name] &&
                option.component === value[name].component
              }
              value={option}
            />
          )}
        </Select>,
      ])}
    </Grid>
  );
};

export default LinkOptionsProperty;
