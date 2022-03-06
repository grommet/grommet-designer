import React from 'react';
import { Box, Button, CheckBox } from 'grommet';
import { FormDown } from 'grommet-icons';

const DataChartAxis = (props) => {
  const { value, onChange } = props;
  return (
    <Box direction="row" margin={{ end: 'small' }} gap="small">
      <CheckBox checked={!!value} onChange={() => onChange(!value)} />
      {value && (
        <Button
          icon={<FormDown />}
          hoverIndicator
          onClick={() => {
            if (typeof value === 'object') onChange(true);
            else onChange({});
          }}
        />
      )}
    </Box>
  );
};

DataChartAxis.inline = true;

DataChartAxis.dynamicProperty = ({ value }) => {
  if (typeof value === 'object') {
    return {
      x: {
        property: '',
        granularity: ['coarse', 'medium', 'fine'],
      },
      y: {
        property: '',
        granularity: ['coarse', 'medium', 'fine'],
      },
    };
  }
  return DataChartAxis;
};

export default DataChartAxis;
