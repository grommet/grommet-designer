import React, { useEffect, useMemo, useState } from 'react';
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
import { More } from 'grommet-icons';
import { publish, revert, unpublish, useDesign } from '../design2';
import Action from '../components/Action';

const Publish = ({ onClose }) => {
  const design = useDesign();
  const [publication, setPublication] = useState();
  const [changing, setChanging] = useState();
  const [error, setError] = useState();

  const versions = useMemo(() => {
    let result = [];
    if (design.publishedVersions) result = [...design.publishedVersions];
    if (design.publishedUrl)
      result.push({
        suffix: '',
        date: design.publishedDate,
        url: design.publishedUrl,
      });
    return result;
  }, [design]);

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
        <Accordion>
          <AccordionPanel label="security">
            <Paragraph>
              We use your email combined with a PIN # so that nobody else can
              modify your published copy.
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
            <FormField
              name="password"
              label="Password to access"
              help="optional"
              margin={{ bottom: 'medium' }}
            >
              <TextInput name="password" type="password" />
            </FormField>
          </AccordionPanel>
        </Accordion>

        {versions.length > 0 && (
          <>
            <Header>
              <Heading level="2" size="small">
                versions
              </Heading>
              {changing && <Spinner />}
            </Header>

            <List data={versions} pad="none">
              {(version) => (
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
                  </Box>
                  <Box flex={false} direction="row" align="center">
                    <Menu
                      icon={<More />}
                      items={[
                        {
                          label: 'revert to',
                          onClick: () => {
                            onRevert({ id: version.id });
                          },
                        },
                        {
                          label: 'delete',
                          onClick: () =>
                            onDelete({ id: version.id, pin: publication.pin }),
                        },
                      ]}
                    />
                    <Button
                      label="re-publish"
                      hoverIndicator
                      disabled={changing}
                      onClick={() => {
                        onPublish({ ...publication, suffix: version.suffix });
                      }}
                    />
                  </Box>
                </Box>
              )}
            </List>
            <Heading level={2} size="small" margin={{ top: 'large' }}>
              new version
            </Heading>
          </>
        )}

        <FormField name="suffix" label="version suffix">
          <TextInput name="suffix" />
        </FormField>
        <Box align="start" margin={{ vertical: 'medium' }}>
          <Button type="submit" label="Publish" secondary disabled={changing} />
        </Box>
      </Form>
    </Action>
  );
};

export default Publish;
