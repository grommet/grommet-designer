import React, { Component } from 'react';
import {
  Box, Button, Heading, Layer, Text, TextInput
} from 'grommet';
import { Close, Copy, Download } from 'grommet-icons';
import LZString from 'lz-string';

export default class Share extends Component {

  state = {};

  ref = React.createRef();

  onCopy = () => {
    this.ref.current.select();
    document.execCommand('copy');
    this.setState({ message: 'copied to clipboard!'});
  }

  render() {
    const { design, onClose } = this.props;
    const { message } = this.state;
    const encoded = LZString.compressToEncodedURIComponent(JSON.stringify(design));
    const url = `${window.location.href.split('?')[0]}?preview=true&d=${encoded}`;
    return (
      <Layer onEsc={onClose}>
        <Box pad="medium" gap="medium">
          <Box
            direction="row"
            gap="medium"
            align="center"
            justify="between"
          >
            <Heading level={2} margin="none">
              Share
            </Heading>
            <Button icon={<Close />} hoverIndicator onClick={onClose} />
          </Box>
          <Heading level={3} margin="none">Browser</Heading>
          <Box>
            <Box direction="row">
              <TextInput ref={this.ref} value={url} />
              <Button icon={<Copy />} onClick={this.onCopy} />
            </Box>
            <Box>
              <Text textAlign="end">{message}&nbsp;</Text>
            </Box>
          </Box>
          <Heading level={3} margin="none">Developer</Heading>
          <Button icon={<Download />} label="Download JSX" disabled />
        </Box>
      </Layer>
    );
  }
}
