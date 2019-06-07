import React, { Component, Fragment } from 'react';
import {
  Box, Button, Form, FormField, Heading, Layer, Markdown, MaskedInput, Paragraph,
  Text, TextArea, TextInput
} from 'grommet';
import { Close, CloudUpload, Copy, Code, Download } from 'grommet-icons';
// import LZString from 'lz-string';
import { bucketPostUrl, bucketKey, generateJSX } from './designs';

export default class Share extends Component {

  state = { identity: {} };

  ref = React.createRef();

  componentDidMount() {
    const { design } = this.props;
    const json = localStorage.getItem('identity');
    if (json) {
      const identity = JSON.parse(json);
      this.setState({ publication: { ...identity, name: design.name } });
    }
  }

  onCopy = () => {
    this.ref.current.select();
    document.execCommand('copy');
    this.setState({ message: 'copied to clipboard!'});
  }

  onPublish = ({ name, email, pin }) => {
    const { design, onChange } = this.props;

    // remember email and pin in local storage so we can use later
    localStorage.setItem('identity', JSON.stringify({ email, pin }));

    // add some metadata to the design
    const nextDesign = JSON.parse(JSON.stringify(design));
    nextDesign.name = name;
    nextDesign.email = email;
    const date = new Date();
    date.setMilliseconds(pin);
    nextDesign.date = date.toISOString();

    const fileName = encodeURIComponent(`${design.name}.${email.replace('@', '.')}`);
    const body = JSON.stringify(design);
    fetch(
      `${bucketPostUrl}?uploadType=media&name=${fileName}&${bucketKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/javascript; charset=UTF-8',
          'Content-Length': body.length,
        },
        body,
      },
    )
    .then((response) => {
      if (response.ok) {
        const uploadUrl =
          `${window.location.href.split('?')[0]}?n=${fileName}`;
        this.setState({ uploadUrl });
      }
    });
    onChange({ design: nextDesign });
  }

  render() {
    const { design, onClose } = this.props;
    const { code, message, publication, publish, uploadUrl } = this.state;
    // const encoded = LZString.compressToEncodedURIComponent(JSON.stringify(design));
    // const url = `${window.location.href.split('?')[0]}?preview=true&d=${encoded}`;
    return (
      <Layer onEsc={onClose}>
        <Box>
          <Box pad="medium" direction="row" gap="medium" align="center" justify="between">
            <Heading level={2} margin="none">
              Share
            </Heading>
            <Button icon={<Close />} hoverIndicator onClick={onClose} />
          </Box>
          <Box pad="medium" overflow="auto" gap="large">
            <Box flex={false}>
              <Box direction="row" align="center" justify="between" gap="medium">
                <Heading level={3} margin="none">Publish</Heading>
                <Button
                  icon={<CloudUpload />}
                  title="Publish Design"
                  hoverIndicator
                  onClick={() => this.setState({ publish: !publish })}
                />
              </Box>
              {publish && (
                <Form
                  value={publication}
                  onSubmit={({ value }) => this.onPublish(value)}
                >
                  <Paragraph>
                    We use your email and PIN # to restrict editing of what you
                    share.
                  </Paragraph>
                  <FormField
                    name="name"
                    label="Name"
                    required
                    validate={{ regexp: /\w+/ }}
                  />
                  <FormField
                    name="email"
                    label="Email"
                    required
                    validate={{ regexp: /\w+@\w+\.\w+/ }}
                  />
                  <FormField
                    name="pin"
                    label="PIN"
                    required
                    validate={{ regexp: /\d{3}/, message: 'three digits' }}
                    component={MaskedInput}
                    type="password"
                    mask={[
                      {
                        length: 3,
                        regexp: /^\d{1,3}$/,
                        placeholder: '###',
                      },
                    ]}
                  />
                  <Button type="submit" label="Publish" />
                </Form>
              )}
              {uploadUrl && (
                <Fragment>
                  <Box direction="row">
                    <TextInput ref={this.ref} value={uploadUrl} />
                    <Button
                      icon={<Copy />}
                      title="Copy URL"
                      hoverIndicator
                      onClick={this.onCopy}
                    />
                  </Box>
                  <Box>
                    <Text textAlign="end">{message}&nbsp;</Text>
                  </Box>
                </Fragment>
              )}
            </Box>
            <Box flex={false} direction="row" align="center" justify="between" gap="medium">
              <Heading level={3} margin="none">Download</Heading>
              <Button
                icon={<Download />}
                title="Download Design"
                hoverIndicator
                href={`data:application/json;charset=utf-8,${JSON.stringify(design)}`}
                download={`${design.name || 'design'}.json`}
                onClick={onClose}
              />
            </Box>
            <Box flex={false}>
              <Box direction="row" align="center" justify="between" gap="medium">
                <Heading level={3} margin="none">Developer</Heading>
                <Button
                  icon={<Code />}
                  title="Generate Code"
                  hoverIndicator
                  onClick={() => this.setState({ code: generateJSX(design) })}
                />
              </Box>
              {code && (
                <Box>
                  <Markdown>{`
    * install nodejs, npm, yarn, and create-react-app (if needed)
    * \`# create-react-app my-app\`
    * \`# cd my-app\`
    * \`# yarn add grommet grommet-icons styled-components\`
    * replace the contents of \`src/App.js\` with the text below
    * \`# yarn start\`
                    `}
                  </Markdown>
                  <TextArea value={code} rows={20} cols={40} readOnly />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Layer>
    );
  }
}
