import React from 'react';
import { Box, Button, Drop, Text } from 'grommet';

export default ({ title, ...rest }) => {
  const ref = React.useRef();
  const [hover, setHover] = React.useState();

  React.useEffect(() => {
    if (!hover) return;
    const timer = setTimeout(() => setHover(false), 3000);
    return () => clearTimeout(timer);
  }, [hover]);

  return (
    <Box flex={false}>
      <Button
        ref={ref}
        hoverIndicator
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        {...rest}
      />
      {hover && (
        <Drop target={ref.current} align={{ top: 'bottom' }} plain>
          <Box
            margin="xsmall"
            animation="fadeIn"
            background={{ color: 'light-1', opacity: 'strong' }}
            pad="xsmall"
          >
            <Text>{title}</Text>
          </Box>
        </Drop>
      )}
    </Box>
  );
};
