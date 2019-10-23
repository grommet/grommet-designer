import React, { Component } from 'react';
import { Box, Text } from 'grommet';
import { Alert } from 'grommet-icons';

// have to use a class to use componentDidCatch()
class ErrorCatcher extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.error && prevState.error !== nextProps.design) {
      return { error: undefined };
    }
    return null;
  }

  state = {};

  componentDidCatch() {
    this.setState({ error: this.props.design });
  }

  render() {
    const { children } = this.props;
    const { error } = this.state;
    if (error) {
      return (
        <Box align="center" justify="center" background="white" gap="medium">
          <Alert color="status-critical" size="large" />
          <Text color="status-critical" size="large">
            something broke
          </Text>
        </Box>
      );
    }
    return children;
  }
}

export default ErrorCatcher;
