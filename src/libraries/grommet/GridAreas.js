import React, { Fragment } from 'react';
import {
  Box,
  Button,
  FormField,
  Markdown,
  MaskedInput,
  Paragraph,
  TextInput,
} from 'grommet';
import { Add, Trash } from 'grommet-icons';

const CoordinateInput = ({ value, index, name, max, onChange }) => (
  <MaskedInput
    mask={[
      {
        regexp: new RegExp(`^[0-${max[0]}]$`),
        length: 1,
        placeholder: 'column',
      },
      { fixed: ',' },
      { regexp: new RegExp(`^[0-${max[1]}]$`), length: 1, placeholder: 'row' },
    ]}
    value={value[index][name].map((v) => (v === undefined ? '' : v)).join(',')}
    onChange={(event) => {
      const nextValue = JSON.parse(JSON.stringify(value));
      nextValue[index][name] = event.target.value
        .split(',')
        .map((v) => (v === '' ? undefined : parseInt(v, 10)));
      onChange(nextValue);
    }}
  />
);

const GridAreas = ({ component, responsiveSize, value, onChange }) => {
  let { columns, rows } = component.props;
  if (component.responsive && component.responsive[responsiveSize]) {
    const responsiveProps = component.responsive[responsiveSize].props;
    if (responsiveProps.columns) ({ columns } = responsiveProps);
    if (responsiveProps.rows) ({ rows } = responsiveProps);
  }
  const missing = !Array.isArray(rows) || !Array.isArray(columns);
  const max = !missing && [columns.length - 1, rows.length - 1];
  return (
    <Box>
      {missing ? (
        <Markdown>
          Make sure you set up **rows** and **columns** as arrays first!
        </Markdown>
      ) : (
        <Fragment>
          <Paragraph>
            You have {max[0] + 1} columns and {max[1] + 1} rows to work with.
          </Paragraph>
          {Array.isArray(value) && (
            <Box direction="row" gap="medium">
              {value.map((area, index) => (
                <Box key={index}>
                  <Box flex="grow">
                    <FormField label="name">
                      <TextInput
                        value={area.name}
                        onChange={(event) => {
                          const nextValue = JSON.parse(JSON.stringify(value));
                          nextValue[index].name = event.target.value;
                          onChange(nextValue);
                        }}
                      />
                    </FormField>
                    <FormField label="start">
                      <CoordinateInput
                        value={value}
                        index={index}
                        name="start"
                        max={max}
                        onChange={onChange}
                      />
                    </FormField>
                    <FormField label="end">
                      <CoordinateInput
                        value={value}
                        index={index}
                        name="end"
                        max={max}
                        onChange={onChange}
                      />
                    </FormField>
                  </Box>
                  <Button
                    icon={<Trash />}
                    hoverIndicator
                    onClick={() => {
                      const nextValue = JSON.parse(JSON.stringify(value));
                      nextValue.splice(index, 1);
                      onChange(nextValue.length > 0 ? nextValue : undefined);
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}
          <Button
            icon={<Add />}
            hoverIndicator
            onClick={() => {
              const nextValue = value ? JSON.parse(JSON.stringify(value)) : [];
              nextValue.push({ name: '', start: [], end: [] });
              onChange(nextValue);
            }}
          />
        </Fragment>
      )}
    </Box>
  );
};

export default GridAreas;
