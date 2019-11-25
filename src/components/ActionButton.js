import React from 'react';
import { Box, Button, Drop, Text } from 'grommet';

export default ({ title, ...rest }) => {
  const ref = React.useRef();
  const [hover, setHover] = React.useState();

  React.useEffect(() => {
    if (!hover) return;
    const timer = setTimeout(() => setHover(false), 2000);
    return () => clearTimeout(timer);
  }, [hover]);

  return (
    <>
      <Button
        ref={ref}
        hoverIndicator
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        {...rest}
      />
      {hover && (
        <Drop target={ref.current} align={{ top: 'bottom' }} plain>
          <Box margin="xsmall" background={{ color: 'light-1' }} pad="xsmall">
            <Text>{title}</Text>
          </Box>
        </Drop>
      )}
    </>
  );
};
