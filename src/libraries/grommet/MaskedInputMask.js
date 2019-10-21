import React, { Fragment } from 'react';
import {
  Box,
  Button,
  FormField,
  MaskedInput,
  Text,
  TextArea,
  TextInput,
} from 'grommet';
import { Add, Trash } from 'grommet-icons';

export default ({ value, onChange }) => {
  return (
    <Box direction="row" gap="medium" overflow="auto">
      {(value || [{}]).map((element, index) => (
        <Box flex={false} key={index}>
          <Box flex="grow">
            <FormField label="fixed">
              <TextInput
                value={element.fixed || ''}
                onChange={event => {
                  const nextValue = JSON.parse(JSON.stringify(value || [{}]));
                  nextValue[index].fixed = event.target.value;
                  onChange(nextValue);
                }}
              />
            </FormField>
            {!element.fixed && (
              <Fragment>
                <FormField label="length">
                  <Box>
                    <Box
                      direction="row"
                      align="center"
                      pad={{ horizontal: 'small' }}
                    >
                      <Text>min</Text>
                      <MaskedInput
                        plain
                        mask={[{ regexp: /^[0-9]+$/ }]}
                        value={
                          (element.length || [])[0] === undefined
                            ? ''
                            : (element.length || [])[0]
                        }
                        onChange={event => {
                          const min = event.target.value;
                          const nextValue = JSON.parse(
                            JSON.stringify(value || [{}]),
                          );
                          if (!nextValue[index].length)
                            nextValue[index].length = [];
                          nextValue[index].length[0] =
                            min.length > 0 ? parseInt(min, 10) : undefined;
                          onChange(nextValue);
                        }}
                        style={{ width: '96px' }}
                      />
                    </Box>
                    <Box
                      direction="row"
                      align="center"
                      pad={{ horizontal: 'small' }}
                    >
                      <Text>max</Text>
                      <MaskedInput
                        plain
                        mask={[{ regexp: /^[0-9]+$/ }]}
                        value={
                          (element.length || [])[1] === undefined
                            ? ''
                            : (element.length || [])[1]
                        }
                        onChange={event => {
                          const max = event.target.value;
                          const nextValue = JSON.parse(
                            JSON.stringify(value || [{}]),
                          );
                          if (!nextValue[index].length)
                            nextValue[index].length = [];
                          nextValue[index].length[1] =
                            max.length > 0 ? parseInt(max, 10) : undefined;
                          onChange(nextValue);
                        }}
                        style={{ width: '96px' }}
                      />
                    </Box>
                  </Box>
                </FormField>
                <FormField label="options" help="one per line">
                  <TextArea
                    value={element.options ? element.options.join('\n') : ''}
                    onChange={event => {
                      const nextValue = JSON.parse(
                        JSON.stringify(value || [{}]),
                      );
                      nextValue[index].options = event.target.value.split('\n');
                      onChange(nextValue);
                    }}
                  />
                </FormField>
                <FormField label="placeholder">
                  <TextInput
                    value={element.placeholder || ''}
                    onChange={event => {
                      const nextValue = JSON.parse(
                        JSON.stringify(value || [{}]),
                      );
                      nextValue[index].placeholder = event.target.value;
                      onChange(nextValue);
                    }}
                  />
                </FormField>
                <FormField label="regexp">
                  <TextInput
                    value={element.regexp ? element.regexp.toString() : ''}
                    onChange={event => {
                      let exp = event.target.value;
                      const match = exp.match(/^\/(.*)\/$/);
                      if (match) exp = match[1];
                      const nextValue = JSON.parse(
                        JSON.stringify(value || [{}]),
                      );
                      nextValue[index].regexp =
                        exp.length > 0 ? new RegExp(exp) : undefined;
                      onChange(nextValue);
                    }}
                  />
                </FormField>
              </Fragment>
            )}
          </Box>
          {value && value.length > 1 && (
            <Button
              icon={<Trash />}
              hoverIndicator
              onClick={() => {
                const nextValue = JSON.parse(JSON.stringify(value));
                nextValue.splice(index, 1);
                onChange(nextValue);
              }}
            />
          )}
        </Box>
      ))}
      <Button
        icon={<Add />}
        hoverIndicator
        onClick={() => {
          const nextValue = JSON.parse(JSON.stringify(value || []));
          nextValue.push({});
          onChange(nextValue);
        }}
      />
    </Box>
  );
};
