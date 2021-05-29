import React, { useState } from 'react';
import {
  Box,
  Button,
  CheckBox,
  Footer,
  FormField,
  Header,
  List,
  Select,
  Text,
  TextInput,
} from 'grommet';
import { Add, FormNext, Previous, Trash } from 'grommet-icons';
import useDebounce from './useDebounce';
import BackButton from './BackButton';
import ReorderIcon from './ReorderIcon';

const Column = ({ ComponentInput, value, onChange, ...rest }) => {
  const [column, setColumn] = useDebounce(value, onChange);

  const setField = (name, fieldValue) => {
    const nextColumn = JSON.parse(JSON.stringify(column));
    if (fieldValue) nextColumn[name] = fieldValue;
    else delete nextColumn[name];
    setColumn(nextColumn);
  };

  return (
    <Box flex={false}>
      <FormField label="property">
        <TextInput
          name="property"
          value={column.property || ''}
          onChange={(event) => setField('property', event.target.value)}
        />
      </FormField>
      <FormField label="header">
        <TextInput
          name="header"
          value={column.header || ''}
          onChange={(event) => setField('header', event.target.value)}
        />
      </FormField>
      <FormField label="units">
        <TextInput
          name="units"
          value={column.units || ''}
          onChange={(event) => setField('units', event.target.value)}
        />
      </FormField>
      <FormField label="render">
        <ComponentInput
          {...rest}
          name="render"
          value={column.render}
          onChange={(id, nextDesign) => {
            const nextColumn = JSON.parse(JSON.stringify(column));
            if (id) nextColumn.render = id;
            else delete nextColumn.render;
            onChange(nextColumn, nextDesign);
          }}
        />
      </FormField>
      <FormField label="align">
        <Select
          options={['start', 'center', 'end', 'undefined']}
          value={column.align || ''}
          onChange={({ option }) =>
            setField('align', option === 'undefined' ? undefined : option)
          }
        />
      </FormField>
      <FormField label="verticalAlign">
        <Select
          options={['top', 'middle', 'bottom', 'undefined']}
          value={column.verticalAlign || ''}
          onChange={({ option }) =>
            setField(
              'verticalAlign',
              option === 'undefined' ? undefined : option,
            )
          }
        />
      </FormField>
      <FormField>
        <Box pad="small">
          <CheckBox
            label="primary"
            checked={column.primary || false}
            onChange={(event) => setField('primary', event.target.checked)}
          />
        </Box>
      </FormField>
      {['search', 'sortable'].map((subProp) => (
        <FormField key={subProp}>
          <Box pad="small">
            <CheckBox
              label={subProp}
              checked={column[subProp] || false}
              onChange={(event) => (event) =>
                setField(subProp, event.target.checked)}
            />
          </Box>
        </FormField>
      ))}
      <FormField label="aggregate">
        <Select
          options={['avg', 'max', 'min', 'sum', 'undefined']}
          value={column.aggregate || ''}
          onChange={({ option }) =>
            setField('aggregate', option === 'undefined' ? undefined : option)
          }
        />
      </FormField>
      {column.aggregate ? (
        <FormField>
          <Box pad="small">
            <CheckBox
              label="footer aggregate"
              checked={!!column.footer || false}
              onChange={(event) =>
                setField(
                  'footer',
                  event.target.checked ? { aggregate: true } : undefined,
                )
              }
            />
          </Box>
        </FormField>
      ) : (
        <FormField label="footer">
          <TextInput
            value={column.footer || ''}
            onChange={(event) => setField('footer', event.target.value)}
          />
        </FormField>
      )}
      <FormField>
        <Box pad="small">
          <CheckBox
            label="pin"
            checked={!!column.pin || false}
            onChange={(event) =>
              setField('pin', event.target.checked ? true : undefined)
            }
          />
        </Box>
      </FormField>
    </Box>
  );
};

const DataTableColumns = ({ value = [], onChange, ...rest }) => {
  const [active, setActive] = useState();
  const [reorder, setReorder] = useState();

  if (active !== undefined) {
    const column = value[active];
    return (
      <Box>
        <Header>
          <BackButton
            title="back to columns"
            onClick={() => setActive(undefined)}
          />
          <Button
            icon={<Trash />}
            hoverIndicator
            tip={{
              content: 'Delete column',
              dropProps: { align: { right: 'left' } },
            }}
            onClick={() => {
              const nextValue = JSON.parse(JSON.stringify(value));
              nextValue.splice(active, 1);
              onChange(nextValue.length ? nextValue : undefined);
              setActive(undefined);
            }}
          />
        </Header>
        <Column
          value={column}
          onChange={(nextColumn, nextDesign) => {
            const nextValue = JSON.parse(JSON.stringify(value));
            nextValue[active] = nextColumn;
            onChange(nextValue, nextDesign);
          }}
          {...rest}
        />
      </Box>
    );
  }

  if (reorder)
    return (
      <Box pad={{ bottom: 'small' }} gap="small">
        <List data={value} pad="none" onOrder={onChange}>
          {(column) => (
            <Box>
              <Text>{column.header || column.property}</Text>
            </Box>
          )}
        </List>
        <Footer>
          <BackButton
            title="back to columns"
            onClick={() => setReorder(false)}
          />
        </Footer>
      </Box>
    );

  return (
    <Box gap="small" pad={{ top: 'small' }}>
      <List
        data={value}
        pad="small"
        onClickItem={({ index }) => setActive(index)}
      >
        {(column, i) => (
          <Box
            key={i}
            flex="grow"
            direction="row"
            align="center"
            justify="between"
            gap="medium"
          >
            <Text>{column.header || column.property}</Text>
            <FormNext />
          </Box>
        )}
      </List>
      <Footer>
        <Button
          icon={<Add />}
          tip={{
            content: 'Add column',
            dropProps: { align: { left: 'right' } },
          }}
          hoverIndicator
          onClick={() => {
            const nextValue = JSON.parse(JSON.stringify(value || []));
            nextValue.push({});
            onChange(nextValue);
            setActive(nextValue.length - 1);
          }}
        />
        <Button
          icon={<ReorderIcon />}
          tip={{
            content: 'Re-order columns',
            dropProps: { align: { right: 'left' } },
          }}
          hoverIndicator
          onClick={() => setReorder(true)}
        />
      </Footer>
    </Box>
  );
};

export default DataTableColumns;
