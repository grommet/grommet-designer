import React from 'react';
import { Box, Grommet, Paragraph } from 'grommet';
import { getTheme } from './design2';
import DesignComponent from './DesignComponent';

const Canvas = ({ root }) => {
  const theme = getTheme();

  const content = root ? (
    <DesignComponent id={root} />
  ) : (
    <Box align="center">
      <Paragraph size="large" textAlign="center" color="placeholder">
        This is currently empty. Add a layout component to start building it
        out.
      </Paragraph>
    </Box>
  );

  return (
    <Grommet
      id="designer-canvas"
      theme={theme}
      // themeMode={themeMode}
      full="min"
      style={{ height: '1px' }}
    >
      {content}
    </Grommet>
  );
};

export default Canvas;
