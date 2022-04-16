import React, { useContext } from 'react';
import { Box, Grommet, Paragraph } from 'grommet';
import DesignContext from './Design2Context';
import SelectionContext from './SelectionContext';
import DesignComponent from './DesignComponent';

const Canvas = () => {
  const { theme, themeMode } = useContext(DesignContext);
  const { property, screen } = useContext(SelectionContext);

  let content;
  if (property)
    if (property.component)
      // showing just a property component, no screen
      content = (
        <Box align="center" justify="center">
          <DesignComponent id={property.component} />
        </Box>
      );
    else
      content = (
        <Box align="center">
          <Paragraph size="large" textAlign="center" color="placeholder">
            {property.name} is currently empty. Add a component to it to to
            start building it out.
          </Paragraph>
        </Box>
      );
  else if (screen?.root) content = <DesignComponent id={screen?.root} />;
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
      themeMode={themeMode}
      full="min"
      style={{ height: '1px' }}
    >
      {content}
    </Grommet>
  );
};

export default Canvas;
