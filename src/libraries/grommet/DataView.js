import React from 'react';
import { Box, FormField, RadioButtonGroup, TextArea, TextInput } from 'grommet';
import useDebounce from './useDebounce';
import ObjectOfObjects from './ObjectOfObjects';

const DataViewProperty = ({ id, value = [], onChange }) => {
  const [item, setItem] = useDebounce(value, onChange);

  return (
    <Box flex="grow" align="end">
      <Box flex="grow">
        <Box pad="small">
          <RadioButtonGroup
            options={['values', 'range']}
            value={Array.isArray(value) ? 'values' : 'range'}
            onChange={(event) => {
              if (event.target.value === 'values') setItem([]);
              else if (event.target.value === 'range')
                setItem({ min: 0, max: 100 });
            }}
          />
        </Box>
        {Array.isArray(item) ? (
          <FormField label="values" help="one per line">
            <TextArea
              value={item ? item.join('\n') : ''}
              onChange={(event) => {
                const nextItem = event.target.value.split('\n');
                setItem(nextItem);
              }}
            />
          </FormField>
        ) : (
          <>
            <FormField label="min">
              <TextInput
                value={item.min || ''}
                onChange={(event) => {
                  const nextItem = JSON.parse(JSON.stringify(item));
                  nextItem.min = event.target.value;
                  setItem(nextItem);
                }}
              />
            </FormField>
            <FormField label="max">
              <TextInput
                value={item.max || ''}
                onChange={(event) => {
                  const nextItem = JSON.parse(JSON.stringify(item));
                  nextItem.search = event.target.value;
                  setItem(nextItem);
                }}
              />
            </FormField>
          </>
        )}
      </Box>
    </Box>
  );
};

const DataView = ({ value = {}, onChange, ...rest }) => {
  const [item, setItem] = useDebounce(value, onChange);

  return (
    <Box flex="grow" align="end">
      <Box flex="grow">
        <FormField label="name">
          <TextInput
            value={item.name || ''}
            onChange={(event) => {
              const nextItem = JSON.parse(JSON.stringify(item));
              nextItem.name = event.target.value;
              setItem(nextItem);
            }}
          />
        </FormField>
        <FormField label="search">
          <TextInput
            value={item.search || ''}
            onChange={(event) => {
              const nextItem = JSON.parse(JSON.stringify(item));
              nextItem.search = event.target.value;
              setItem(nextItem);
            }}
          />
        </FormField>
        <FormField label="properties" pad={{ left: 'medium' }}>
          <ObjectOfObjects
            name="properties"
            itemKey="name"
            labelKey="name"
            defaultObject={[]}
            messages={{ single: 'property', plural: 'properties' }}
            value={item.properties}
            Edit={DataViewProperty}
            onChange={(nextProperties) => {
              setItem((prevItem) => ({
                ...prevItem,
                properties: nextProperties,
              }));
            }}
          />
        </FormField>
        <FormField label="sort property">
          <TextInput
            value={item?.sort?.property || ''}
            onChange={(event) => {
              const nextItem = JSON.parse(JSON.stringify(item));
              nextItem.sort = {
                ...(nextItem.sort || {}),
                property: event.target.value,
              };
              setItem(nextItem);
            }}
          />
        </FormField>
        <FormField label="sort direction">
          <RadioButtonGroup
            options={['asc', 'desc']}
            value={item?.sort?.direction}
            onChange={(event) => {
              const nextItem = JSON.parse(JSON.stringify(item));
              nextItem.sort = {
                ...(nextItem.sort || {}),
                direction: event.target.value,
              };
              setItem(nextItem);
            }}
          />
        </FormField>
      </Box>
    </Box>
  );
};

export default DataView;
