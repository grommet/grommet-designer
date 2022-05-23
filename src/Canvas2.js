import React, { useContext } from 'react';
import { Box, Grommet, Paragraph } from 'grommet';
import { getTheme } from './design2';
import AppContext from './AppContext';
import DesignComponent from './DesignComponent';

const Canvas = ({ root }) => {
  const { direction, grommetThemeMode } = useContext(AppContext);
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
      themeMode={grommetThemeMode}
      dir={direction}
      full="min"
      style={{ height: '1px' }}
    >
      {content}
    </Grommet>
  );
};

export default Canvas;
