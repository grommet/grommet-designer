import React, { useEffect, useRef, useState } from 'react';
import ReactGA from 'react-ga';
import {
  Box,
  Button,
  Form,
  FormField,
  Grid,
  MaskedInput,
  Paragraph,
  Spinner,
  Text,
  TextInput,
} from 'grommet';
import { Copy } from 'grommet-icons';
import { publish, revert, useDesign } from '../design2';
import Action from '../components/Action';

const Publish = ({ onClose }) => {
  const design = useDesign();
  const [publication, setPublication] = useState();
  const [publishing, setPublishing] = useState();
  const [reverting, setReverting] = useState();
  const [message, setMessage] = useState();
  const [error, setError] = useState();
  const previewRef = useRef();
  // const commentRef = useRef();

  useEffect(() => {
    let stored = localStorage.getItem(`${design.name}--identity`);
    if (stored) {
      const identity = JSON.parse(stored);
      setPublication({ ...identity, name: design.name });
    } else {
      stored = localStorage.getItem('identity');
      if (stored) {
        const identity = JSON.parse(stored);
        setPublication({ ...identity, name: design.name });
      } else {
        setPublication({ name: design.name });
      }
    }
  }, [design]);

  const onPublish = ({ value: { email, password, pin } }) => {
    // remember email and pin in local storage so we can use later
    localStorage.setItem(
      `${design.name}--identity`,
      JSON.stringify({ email, pin }),
    );
    localStorage.setItem('identity', JSON.stringify({ email, pin }));
    setPublishing(true);
    publish({ email, password, pin })
      .then(() => {
        setPublishing(false);
        ReactGA.event({
          category: 'share',
          action: 'publish design',
        });
      })
      .catch((error) => {
        setPublishing(false);
        setError(error);
      });
  };

  return (
    <Action label="publish" animation="fadeIn" onClose={onClose}>
      <Paragraph>
        Publishing your design will generate a URL that you can send to others
        so they can see it. We use your email and PIN # so nobody else can
        modify your copy. They will be able to create their own design based on
        it.
      </Paragraph>
      <Form
        value={publication}
        onChange={({ value }) => setPublication(value)}
        onSubmit={onPublish}
      >
        <FormField
          name="email"
          label="Email"
          required
          validate={{ regexp: /\w+@\w+\.\w+/ }}
        >
          <TextInput name="email" />
        </FormField>
        <FormField
          name="pin"
          label="PIN to change"
          required
          validate={{ regexp: /\d{3}/, message: 'three digits' }}
          error={error}
        >
          <MaskedInput
            name="pin"
            type="password"
            mask={[
              {
                length: 3,
                regexp: /^\d{1,3}$/,
                placeholder: '###',
              },
            ]}
          />
        </FormField>
        <FormField name="password" label="Password to see" help="optional">
          <TextInput name="password" type="password" />
        </FormField>
        <Box align="start" margin={{ vertical: 'medium' }}>
          <Button type="submit" label="Publish" primary disabled={publishing} />
        </Box>
      </Form>
      {publishing && (
        <Box alignSelf="center" animation="pulse">
          <Text size="large">...</Text>
        </Box>
      )}
      {design.publishedDate && (
        <Box
          margin="small"
          align="center"
          direction="row"
          justify="start"
          gap="xxsmall"
        >
          {design.date !== design.publishedDate ? (
            <Text size="small">Modified /</Text>
          ) : null}
          <Text size="small">
            Last published {new Date(design.publishedDate).toLocaleString()}
          </Text>
        </Box>
      )}
      <Grid columns={['flex', 'auto']} gap="small" align="center">
        {design.publishedUrl && [
          <TextInput
            key="i"
            ref={previewRef}
            size="small"
            value={design.publishedUrl}
          />,
          <Button
            key="b"
            icon={<Copy />}
            title="Copy URL"
            hoverIndicator
            onClick={() => {
              previewRef.current.select();
              document.execCommand('copy');
              setMessage('copied to clipboard!');
            }}
          />,
        ]}
      </Grid>
      {message && (
        <Box margin="small" align="center">
          <Text>{message}</Text>
        </Box>
      )}
      {design.id && design.date !== design.publishedDate && (
        <Box
          margin={{ top: 'medium' }}
          alignSelf="start"
          direction="row"
          gap="small"
        >
          <Button
            label="Revert to last published"
            disabled={reverting}
            onClick={() => {
              setReverting(true);
              revert().then(onClose);
            }}
          />
          {reverting && <Spinner />}
        </Box>
      )}
    </Action>
  );
};

export default Publish;
