import React, { Component, Fragment } from 'react';
import {
  Box, Button, Form, FormField, Grid, Heading, Markdown, MaskedInput, Paragraph,
  Text, TextArea, TextInput
} from 'grommet';
import { CloudUpload, Copy, Code, Download } from 'grommet-icons';
import { apiUrl, /* bucketPostUrl, bucketKey, */ generateJSX } from '../design';
import Action from '../components/Action';

const Summary = ({ Icon, label, guidance }) => (
  <Box align="center" gap="small">
    <Icon size="large" />
    <Heading level={3} margin="none">{label}</Heading>
    <Paragraph textAlign="center">{guidance}</Paragraph>
  </Box>
);

const Publish = ({ design, onChange }) => {
  const [publication, setPublication] = React.useState();
  const [uploadUrl, setUploadUrl] = React.useState();
  const [message, setMessage] = React.useState();
  const [error, setError] = React.useState();
  const inputRef = React.useRef();

  React.useEffect(() => {
    const stored = localStorage.getItem('identity');
    if (stored) {
      const identity = JSON.parse(stored);
      setPublication({ ...identity, name: design.name });
    } else {
      setPublication({ name: design.name });
    }
  }, [design]);

  const onPublish = ({ value: { name, email, pin } }) => {
    // remember email and pin in local storage so we can use later
    localStorage.setItem('identity', JSON.stringify({ email, pin }));

    // add some metadata to the design
    const nextDesign = JSON.parse(JSON.stringify(design));
    nextDesign.email = email;
    const date = new Date();
    date.setMilliseconds(pin);
    nextDesign.date = date.toISOString();

    const body = JSON.stringify(nextDesign);
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Content-Length': body.length,
      },
      body,
    })
    .then((response) => {
      if (response.ok) {
        setError(undefined);
        return response.text()
          .then(id => {
            const nextUploadUrl = [
              window.location.protocol,
              window.location.host,
              window.location.pathname,
              `?id=${encodeURIComponent(id)}`,
              window.location.hash,
            ].join('');
            setUploadUrl(nextUploadUrl);
          });
      }
      return response.text().then(setError);
    })
    .catch(e => setError(e.message));

    onChange({ design: nextDesign });
  }

  const onCopy = () => {
    inputRef.current.select();
    document.execCommand('copy');
    setMessage('copied to clipboard!');
  }

  return (
    <Box>
      <Summary Icon={CloudUpload} label="Publish" guidance={`
        Publishing your design will generate a URL
        that you can send to others so they can see it.
        We use your email and PIN # so nobody else can modify your copy.
        They will be able to create their own design based on it.
      `} />
      <Form value={publication} onSubmit={onPublish}>
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
          error={error}
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
        <Box align="center" margin="medium">
          <Button type="submit" label="Publish" />
        </Box>
      </Form>
      {uploadUrl && (
        <Fragment>
          <Box direction="row">
            <TextInput ref={inputRef} value={uploadUrl} />
            <Button
              icon={<Copy />}
              title="Copy URL"
              hoverIndicator
              onClick={onCopy}
            />
          </Box>
          <Box>
            <Text textAlign="end">{message}&nbsp;</Text>
          </Box>
        </Fragment>
      )}
    </Box>
  );
};

const SaveLocally = ({ design, onClose }) => (
  <Box align="center">
    <Summary Icon={Download} label="Download" guidance={`
      Download the design to a JSON file. You can use this as a separate
      backup copy, inspect and transform it with a program, or share
      it with someone else. You can upload it via the top left control
      that shows all of your designs.
    `} />
    <Button
      label="Download"
      hoverIndicator
      href={`data:application/json;charset=utf-8,${JSON.stringify(design)}`}
      download={`${design.name || 'design'}.json`}
      onClick={onClose}
    />
  </Box>
);

const Developer = ({ design }) => {
  const [code, setCode] = React.useState();

  return (
    <Box align="center">
      <Summary Icon={Code} label="Generate Code" guidance={`
        Turn your design into real code that you can use to create a live site.
        While some development knowledge is required, we will give you some
        guidance to get you started.
      `} />
      {!code && (
        <Button
          label="Generate Code"
          hoverIndicator
          onClick={() => setCode(generateJSX(design))}
        />
      )}
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
  );
};

export default class Share extends Component {
  render() {
    const { design, onChange, onClose } = this.props;
    return (
      <Action label="share" onClose={onClose} full>
        <Grid
          fill="horizontal"
          columns={{ count: 'fit', size: "small" }}
          gap="large"
        >
          <Publish design={design} onChange={onChange} />
          <SaveLocally design={design} onClose={onClose} />
          <Developer design={design} />
        </Grid>
      </Action>
    );
  }
}
