import React, { useContext } from 'react';
import { Box, Button, Header, Heading, Text } from 'grommet';
import { Add } from 'grommet-icons';
import { addData, useAllData } from '../design2';
import SelectionContext from '../SelectionContext';

const Data = () => {
  const [selection, setSelection] = useContext(SelectionContext);
  const allData = useAllData();

  return (
    <Box flex={false} border="top">
      <Header>
        <Heading level={3} size="xsmall" margin="small" color="selected-text">
          Data
        </Heading>
        <Button
          icon={<Add />}
          tip="add a data source"
          hoverIndicator
          onClick={() => {
            const newData = addData();
            setSelection(newData.id);
          }}
        />
      </Header>
      {Object.keys(allData).map((id) => (
        <Box key={id} flex={false} border="top">
          <Button fill hoverIndicator onClick={() => setSelection(id)}>
            <Box
              direction="row"
              align="center"
              gap="medium"
              pad={{ vertical: 'xsmall', horizontal: 'small' }}
              background={selection === id ? 'selected-background' : undefined}
            >
              <Text size="medium" truncate>
                {allData[id].name}
              </Text>
            </Box>
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default Data;
