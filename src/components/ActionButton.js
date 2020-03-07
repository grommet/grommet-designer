import React from 'react';
import { Box, Button, Drop, Text } from 'grommet';

export default React.forwardRef(({ title, ...rest }, forwardRef) => {
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
        ref={forwardRef || ref}
        hoverIndicator
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        title={hover ? undefined : title}
        {...rest}
      />
      {hover && (
        <Drop target={(forwardRef || ref).current} align={{ top: 'bottom' }}>
          <Box margin="xsmall" pad="xsmall">
            <Text>{title}</Text>
          </Box>
        </Drop>
      )}
    </>
  );
});
