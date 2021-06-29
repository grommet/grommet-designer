import React, { useState } from 'react';
import { Anchor, Box, Heading } from 'grommet';
import AddButton from './AddButton';
import AddMethod from './AddMethod';

const AddTemplate = ({
  name,
  design: tempDesign,
  onAdd,
  searchExp,
  templates: temps,
  url,
}) => {
  const [addMode, setAddMode] = useState();

  return (
    <Box flex={false} border="top">
      <Box
        pad={{ horizontal: 'small', vertical: 'xsmall' }}
        margin={{ top: 'small' }}
      >
        <Heading level="3" size="small" margin="none">
          {url ? (
            <Anchor target="_blank" href={`${url}&mode=edit`} label={name} />
          ) : (
            name
          )}
        </Heading>
      </Box>
      {Object.keys(temps)
        .filter((name) => !searchExp || name.match(searchExp))
        .map((name) => (
          <AddButton
            key={name}
            label={name}
            onClick={(event) =>
              onAdd({
                addMode,
                containSelected: event.metaKey || event.ctrlKey,
                templateDesign: tempDesign,
                template: temps[name],
                url,
              })
            }
          />
        ))}
      <Box pad="small">
        <AddMethod id={name} value={addMode} onChange={setAddMode} />
      </Box>
    </Box>
  );
};

export default AddTemplate;
