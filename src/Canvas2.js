import React from 'react';
import { Box, Grommet, Paragraph } from 'grommet';
import { getTheme } from './design2';
import DesignComponent from './DesignComponent';

const Canvas = ({ root }) => {
  const theme = getTheme();

  let content;
  if (root?.property)
    if (root.property.component)
      // showing just a property component, no screen
      content = (
        <Box align="center" justify="center">
          <DesignComponent id={root.property.component} />
        </Box>
      );
    else
      content = (
        <Box align="center">
          <Paragraph size="large" textAlign="center" color="placeholder">
            {root.property.name} is currently empty. Add a component to it to to
            start building it out.
          </Paragraph>
        </Box>
      );
  else if (root) content = <DesignComponent id={root} />;
  else
    content = (
      <Box align="center">
        <Paragraph size="large" textAlign="center" color="placeholder">
          This Screen is currently empty. Add a layout component to it to to
          start building it out.
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
