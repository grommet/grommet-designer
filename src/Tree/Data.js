import React from 'react';
import {
  Box, Button, FormField, Paragraph, TextArea, TextInput,
} from 'grommet';
import { Add, Trash } from 'grommet-icons';
import Action from './Action';

const Data = ({ design, onChange, onClose }) => (
  <Action onClose={onClose}>
    <Box flex={false}>
      <Paragraph>
        Data sources can be used to provide consistent content across
        your design.
        These can be JSON or a URL to a REST+json API endpoint.
        Reference the data using curly braces to wrap a path notation
        within component text. For example: {`{<dataname>.<property>}`}.
      </Paragraph>
      {design.data && (
        <Box flex={false}>
          {Object.keys(design.data).map((key) => (
            <Box key={key} direction="row" align="start">
              <Box>
                <FormField label="Name" name="name">
                  <TextInput
                    value={key}
                    onChange={(event) => {
                      if (event.target.value !== key) {
                        const nextDesign = JSON.parse(JSON.stringify(design));
                        nextDesign.data[event.target.value] = nextDesign.data[key];
                        delete nextDesign.data[key];
                        onChange({ design: nextDesign });
                      }
                    }}
                  />
                </FormField>
                <FormField label="Source" name="source">
                  <TextArea
                    cols={40}
                    rows={2}
                    value={design.data[key]}
                    onChange={(event) => {
                      const nextDesign = JSON.parse(JSON.stringify(design));
                      nextDesign.data[key] = event.target.value;
                      onChange({ design: nextDesign });
                    }}
                  />
                </FormField>
              </Box>
              <Button
                icon={<Trash />}
                hoverIndicator
                onClick={() => {
                  const nextDesign = JSON.parse(JSON.stringify(design));
                  delete nextDesign.data[key];
                  if (Object.keys(nextDesign.data).length === 0) {
                    delete nextDesign.data;
                  }
                  onChange({ design: nextDesign });
                }}
              />
            </Box>
          ))}
        </Box>
      )}
      <Box>
        <Button
          icon={<Add />}
          hoverIndicator
          onClick={() => {
            const nextDesign = JSON.parse(JSON.stringify(design));
            if (!nextDesign.data) {
              nextDesign.data = { data: '' };
            } else {
              nextDesign.data[`data-${Object.keys(nextDesign.data).length}`] = '';
            }
            onChange({ design: nextDesign });
          }}
        />
      </Box>
    </Box>
  </Action>
);

export default Data;
