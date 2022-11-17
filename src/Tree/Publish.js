import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import {
  Accordion,
  AccordionPanel,
  Anchor,
  Box,
  Button,
  Form,
  FormField,
  Header,
  Heading,
  List,
  MaskedInput,
  Menu,
  Paragraph,
  Spinner,
  Text,
  TextInput,
} from 'grommet';
import { Add, More, Subtract } from 'grommet-icons';
import { publish, revert, unpublish, useDesign } from '../design2';
import Action from '../components/Action';

const SecurityFields = () => (
  <>
    <Paragraph>
      We use your email combined with a PIN # so that nobody else can modify
      your published copy.
    </Paragraph>
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
    <FormField
      name="password"
      label="Password to access"
      help="optional"
      margin={{ bottom: 'medium' }}
    >
      <TextInput name="password" type="password" />
    </FormField>
  </>
);

const Publish = ({ onClose }) => {
  const design = useDesign();
  const [publication, setPublication] = useState();
  const [changing, setChanging] = useState();
  const [adding, setAdding] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    let stored =
      localStorage.getItem(`${design.name}--identity`) ||
      localStorage.getItem('identity');
    if (stored) {
      const identity = JSON.parse(stored);
      setPublication(identity);
    }
  }, [design]);

  const onPublish = ({ email, password, pin, suffix }) => {
    // remember email and pin in local storage so we can use later
    localStorage.setItem(
      `${design.name}--identity`,
      JSON.stringify({ email, pin }),
    );
    localStorage.setItem('identity', JSON.stringify({ email, pin }));
    setChanging(true);
    publish({ email, password, pin, suffix })
      .then(() => {
        setChanging(false);
        ReactGA.event({
          category: 'share',
          action: 'publish design',
        });
      })
      .catch((err) => {
        setChanging(false);
        setError(err);
      });
  };

  const onRevert = ({ id }) => {
    setChanging(true);
    revert({ id })
      .then(() => {
        setChanging(false);
        ReactGA.event({
          category: 'share',
          action: 'revert design',
        });
      })
      .catch((err) => {
        setChanging(false);
        setError(err);
      });
  };

  const onDelete = ({ id, pin }) => {
    setChanging(true);
    unpublish({ id, pin })
      .then(() => {
        setChanging(false);
        ReactGA.event({
          category: 'share',
          action: 'unpublish design',
        });
      })
      .catch((err) => {
        setChanging(false);
        setError(err);
      });
  };

  const Version = ({ version }) => (
    <Box
      flex={false}
      margin={{ vertical: 'small' }}
      direction="row"
      justify="between"
      align="center"
      gap="large"
    >
      <Box flex={false}>
        <Anchor href={version.url}>
          <Text weight="bold">
            {design.name} {version.suffix}
          </Text>
        </Anchor>
        <Text color="text-weak" size="small">
          {new Date(version.date).toLocaleString()}
        </Text>
        {!version.suffix && design.date !== design.publishedDate && (
          <Text>not up to date</Text>
        )}
      </Box>
      <Box flex={false} direction="row" align="center">
        <Menu
          icon={<More />}
          items={[
            ...(version.suffix
              ? [
                  {
                    label: 're-publish',
                    onClick: () => {
                      onPublish({ ...publication, suffix: version.suffix });
                    },
                  },
                ]
              : []),
            {
              label: 'revert to',
              onClick: () => {
                onRevert({ id: version.id });
              },
            },
            {
              label: 'delete',
              onClick: () => onDelete({ id: version.id, pin: publication.pin }),
            },
          ]}
          dropProps={{ align: { right: 'right', top: 'bottom' } }}
        />
        {!version.suffix && (
          <Button
            label="re-publish"
            secondary={version.suffix ? undefined : true}
            hoverIndicator
            disabled={changing}
            onClick={() => {
              onPublish({ ...publication, suffix: version.suffix });
            }}
          />
        )}
      </Box>
    </Box>
  );

  return (
    <Action label="publish" animation="fadeIn" onClose={onClose}>
      <Paragraph>
        Publishing your design will generate a URL that you can send to others
        so they can see it.
      </Paragraph>

      <Form
        value={publication}
        onChange={setPublication}
        onSubmit={({ value }) => onPublish(value)}
      >
        {design.publishedUrl ? (
          <Accordion>
            <AccordionPanel label="security">
              <SecurityFields />
            </AccordionPanel>
          </Accordion>
        ) : (
          <SecurityFields />
        )}

        {design.publishedUrl ? (
          <Box margin={{ top: 'medium' }}>
            <Version
              version={{
                suffix: '',
                id: design.id,
                date: design.publishedDate,
                url: design.publishedUrl,
              }}
            />
          </Box>
        ) : (
          <Button primary label="publish" type="submit" />
        )}

        <Header>
          <Heading level="2" size="small">
            snapshots
          </Heading>
          {changing && <Spinner />}
          <Button
            icon={adding ? <Subtract /> : <Add />}
            title={`${adding ? 'cancel adding' : 'add'} a snapshot`}
            onClick={() => setAdding(!adding)}
          />
        </Header>

        {adding && (
          <Box
            direction="row"
            gap="medium"
            align="center"
            justify="between"
            margin={{ bottom: 'medium' }}
          >
            <Box direction="row" gap="xsmall" align="baseline">
              <Text>{design.name}</Text>
              <FormField name="suffix">
                <TextInput name="suffix" placeholder="suffix" />
              </FormField>
            </Box>
            <Button
              type="submit"
              label="publish"
              secondary
              disabled={changing}
            />
          </Box>
        )}

        {design.publishedVersions && (
          <List data={design.publishedVersions} pad="none">
            {(version) => <Version version={version} />}
          </List>
        )}
      </Form>
    </Action>
  );
};

export default Publish;
