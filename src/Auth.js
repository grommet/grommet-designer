import React from 'react';
import { Box, Button, Form, TextInput } from 'grommet';
import { Next } from 'grommet-icons';

const Auth = ({ onChange }) => (
  <Box height="100vh" align="center" justify="center">
    <Form
      onSubmit={({ value: { password } }) => {
        onChange(password);
      }}
    >
      <Box direction="row" gap="medium">
        <TextInput
          size="large"
          name="password"
          placeholder="password"
          type="password"
          // onChange={() => setAuth(true)}
        />
        <Button type="submit" icon={<Next />} hoverIndicator />
      </Box>
      {/* <Box pad="small">
        <Text>{typeof auth === 'string' ? auth : ''}&nbsp;</Text>
      </Box> */}
    </Form>
  </Box>
);

export default Auth;
