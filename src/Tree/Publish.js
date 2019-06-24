import React, { Fragment } from 'react';
import {
  Box, Button, Form, FormField, MaskedInput, Paragraph, Text, TextInput,
} from 'grommet';
import { Copy } from 'grommet-icons';
import Action from './Action';
import { bucketPostUrl, bucketKey } from '../designs';

const Publish = ({ design, onClose, onChange }) => {

  const ref = React.createRef();
  const [publication, setPublication] = React.useState();
  const [uploadUrl, setUploadUrl] = React.useState();
  const [message, setMessage] = React.useState();

  React.useEffect(() => {
    const json = localStorage.getItem('identity');
    if (json) {
      const identity = JSON.parse(json);
      setPublication({ ...identity, name: design.name });
    } else {
      setPublication({ name: design.name });
    }
  }, [design]);

  const onPublish = ({ name, email, pin }) => {
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
        setUploadUrl(`${window.location.href.split('?')[0]}?n=${fileName}`);
      }
    });
    onChange({ design: nextDesign });
  };

  const onCopy = () => {
    ref.current.select();
    document.execCommand('copy');
    setMessage('copied to clipboard!');
  };

  return (
    <Action onClose={onClose}>
      <MaskedInput name="x" value="" mask={[{ regexp: /^\w*$/ }]} onChange={e => console.log('!!!', e.target, e.target.value)} />
      <Form
        value={publication}
        onSubmit={({ value }) => onPublish(value)}
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
      {uploadUrl && (
        <Fragment>
          <Box direction="row">
            <TextInput ref={ref} value={uploadUrl} />
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
    </Action>
  );
};

export default Publish;
