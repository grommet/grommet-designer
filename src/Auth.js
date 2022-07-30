import React from 'react';
import { Box, Button, Form, Header, Text, TextInput } from 'grommet';
import { Next } from 'grommet-icons';

const Auth = ({ onCancel, onChange }) => (
  <Box height="100vh">
    <Header justify="center" background="background-contrast">
      <Button href="/" hoverIndicator onClick={onCancel}>
        <Box pad={{ horizontal: 'medium', vertical: 'small' }}>
          <Text>grommet designer</Text>
        </Box>
      </Button>
    </Header>
    <Box flex align="center" justify="center">
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
          />
          <Button type="submit" icon={<Next />} hoverIndicator />
        </Box>
      </Form>
    </Box>
  </Box>
);

export default Auth;
