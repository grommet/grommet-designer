import React, { useEffect, useMemo, useState } from 'react';
// import styled from 'styled-components';
import {
  Box,
  Button,
  FileInput,
  Header,
  Heading,
  // Image,
  List,
  Page,
  PageContent,
  PageHeader,
  Text,
  TextInput,
} from 'grommet';
import { Brush, List as ListIcon, Search } from 'grommet-icons';
import { useDesigns } from './design2';
import AppSettings from './AppSettings';
import Manage from './Manage';
import friendlyDate from './friendlyDate';

// const tutorials = [
//   {
//     title: 'introduction',
//     thumb:
//       'https://us-central1-grommet-designer.cloudfunctions.net/images/eric-soderberg-hpe-com/designer-tutorial-introduction.png',
//     url: 'https://us-central1-grommet-designer.cloudfunctions.net/images/eric-soderberg-hpe-com/designer%20introduction%202a.mp4',
//   },
// ];

const DesignButton = ({
  descriptor: { author, id: idArg, local, name, date, url: urlArg },
  onLoadProps,
}) => {
  const id = idArg || urlArg?.split('id=')[1];
  const url = local
    ? `/?name=${encodeURIComponent(name)}`
    : `/?id=${encodeURIComponent(id)}`;
  return (
    <Button
      fill
      plain
      hoverIndicator
      href={`${url}&mode=edit`}
      onClick={(event) => {
        if (!event.ctrlKey && !event.metaKey) {
          event.preventDefault();
          window.history.pushState(undefined, undefined, url);
          onLoadProps(local ? { name } : { id });
        }
      }}
    >
      <Box direction="row" justify="between" pad="small">
        <Text weight="bold">{name}</Text>
        <Text>{`${local ? '' : `${author} `}${
          local ? 'edited' : 'published'
        } ${friendlyDate(date)}`}</Text>
      </Box>
    </Button>
  );
};

const Start = ({ onLoadProps, onNew }) => {
  const designs = useDesigns({ fetched: true });
  const [search, setSearch] = useState();
  const [error, setError] = useState();
  const [manage, setManage] = useState();
  const [settings, setSettings] = useState();

  useEffect(() => {
    document.title = 'Grommet Designer';
  }, []);

  const searchExp = useMemo(() => search && new RegExp(search, 'i'), [search]);

  const matchingDesigns = useMemo(
    () =>
      designs.filter(({ name }) => !searchExp || name.search(searchExp) !== -1),
    [designs, searchExp],
  );

  return (
    <Page kind="narrow" gap="large" height={{ min: '100vh' }}>
      <PageContent gap="large">
        <PageHeader
          title="grommet designer"
          subtitle="design with grommet components"
          actions={
            <Button
              title="start a new design"
              primary
              label="New"
              href="/_new"
              onClick={(event) => {
                if (!event.ctrlKey && !event.metaKey) {
                  event.preventDefault();
                  onNew();
                }
              }}
            />
          }
        />

        {designs?.length > 0 && (
          <Box>
            <Header>
              <Heading level={2}>designs</Heading>
              {designs.length > 10 && (
                <Box direction="row">
                  <TextInput
                    icon={<Search />}
                    reverse
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                  <Button icon={<ListIcon />} onClick={() => setManage(true)} />
                </Box>
              )}
            </Header>
            <List data={matchingDesigns} pad="none">
              {(descriptor) => {
                return (
                  <DesignButton
                    key={descriptor.id}
                    descriptor={descriptor}
                    onLoadProps={onLoadProps}
                  />
                );
              }}
            </List>
          </Box>
        )}
      </PageContent>

      <PageContent flex align="center" justify="center" animation="fadeIn">
        {!designs?.length && (
          <Text size="3xl" color="text-weak">
            Hi, ... maybe create a new design?
          </Text>
        )}
      </PageContent>

      <PageContent>
        {error && (
          <Box
            background={{ color: 'status-error', opacity: 'weak' }}
            pad="small"
          >
            <Text>{error}</Text>
          </Box>
        )}
        <FileInput
          accept=".json"
          messages={{
            dropPrompt: 'Import - drop design file here',
          }}
          onChange={(event) => {
            setError(undefined);
            const reader = new FileReader();
            reader.onload = () => {
              try {
                const design = JSON.parse(reader.result);
                // TODO: reconcile if we have existing already
                onLoadProps({ design });
              } catch (e) {
                setError(e.message);
              }
            };
            reader.readAsText(event.target.files[0]);
          }}
        />
      </PageContent>

      {/* <Box>
          <Heading level={2}>tutorial</Heading>
          {tutorials.map(({ thumb, title, url }) => (
            <Button key={title} plain href={url} target="_blank">
              <Box gap="xsmall">
                <Box
                  width="medium"
                  height="small"
                  round="xsmall"
                  background="background-front"
                  overflow="hidden"
                >
                  <Image src={thumb} fit="contain" />
                </Box>
                <Text weight="bold" size="large">
                  {title}
                </Text>
              </Box>
            </Button>
          ))}
        </Box> */}

      <PageContent
        background={{ color: 'background-contrast', fill: 'horizontal' }}
      >
        <Box flex={false} align="end">
          <Button
            icon={<Brush />}
            tip="Change settings"
            hoverIndicator
            onClick={() => setSettings(true)}
          />
        </Box>
      </PageContent>

      {settings && <AppSettings onClose={() => setSettings(false)} />}
      {manage && (
        <Manage
          onClose={() => {
            setManage(false);
            // setDesigns([...designs]); // trigger re-load of offloaded state
          }}
        />
      )}
    </Page>
  );
};

export default Start;
