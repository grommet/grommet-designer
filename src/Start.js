import React, { useEffect, useMemo, useState } from 'react';
// import styled from 'styled-components';
import {
  Box,
  Button,
  CheckBox,
  FileInput,
  Header,
  Heading,
  // Image,
  List,
  Markdown,
  Page,
  PageContent,
  PageHeader,
  RadioButtonGroup,
  Text,
  TextInput,
} from 'grommet';
import { List as ListIcon, Search } from 'grommet-icons';
import readmePath from './README.md';
import { parseUrlParams } from './utils';
import Manage from './Manage';

// const tutorials = [
//   {
//     title: 'introduction',
//     thumb:
//       'https://us-central1-grommet-designer.cloudfunctions.net/images/eric-soderberg-hpe-com/designer-tutorial-introduction.png',
//     url: 'https://us-central1-grommet-designer.cloudfunctions.net/images/eric-soderberg-hpe-com/designer%20introduction%202a.mp4',
//   },
// ];

const Start = ({
  colorMode,
  onLoadProps,
  onNew,
  rtl,
  setColorMode,
  setRtl,
}) => {
  const [designs, setDesigns] = useState([]);
  const [designsFetched, setDesignsFetched] = useState([]);
  const [readme, setReadme] = useState();
  const [search, setSearch] = useState();
  const [error, setError] = useState();
  const [manage, setManage] = useState();

  useEffect(() => {
    document.title = 'Grommet Designer';
  }, []);

  // load design names from local storage
  useEffect(() => {
    let stored = localStorage.getItem('designs');
    if (stored) {
      // prune out non-existing designs
      const nextDesigns = JSON.parse(stored).filter((name) =>
        localStorage.getItem(name),
      );
      setDesigns(nextDesigns);
      localStorage.setItem('designs', JSON.stringify(nextDesigns));
    }
  }, []);

  // load previously fetched designs from local storage
  useEffect(() => {
    let stored = localStorage.getItem('designs-fetched');
    if (stored) {
      setDesignsFetched(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    fetch(readmePath)
      .then((response) => {
        if (response.ok) {
          response
            .text()
            .then((text) => setReadme(text.split('\n').splice(8).join('\n')));
        }
      })
      .catch();
  }, []);

  const searchExp = useMemo(() => search && new RegExp(search, 'i'), [search]);

  const designsData = useMemo(() => {
    return designs.filter(
      (name) => !searchExp || name.search(searchExp) !== -1,
    );
  }, [designs, searchExp]);

  const designsFetchedData = useMemo(() => {
    return designsFetched.filter(
      ({ name }) => !searchExp || name.search(searchExp) !== -1,
    );
  }, [designsFetched, searchExp]);

  return (
    <Page kind="narrow" gap="large">
      <PageContent gap="large">
        <PageHeader
          margin={{ top: 'large' }}
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
              <Heading level={2}>my designs</Heading>
              {designs.length > 1 && (
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
            <List data={designsData} pad="none">
              {(name) => {
                const url = `/?name=${encodeURIComponent(name)}`;
                return (
                  <Button
                    key={name}
                    fill
                    plain
                    hoverIndicator
                    href={`${url}&mode=edit`}
                    onClick={(event) => {
                      if (!event.ctrlKey && !event.metaKey) {
                        event.preventDefault();
                        window.history.pushState(undefined, undefined, url);
                        onLoadProps({ name });
                      }
                    }}
                  >
                    <Box pad="small">{name}</Box>
                  </Button>
                );
              }}
            </List>
          </Box>
        )}

        {designsFetched?.length > 0 && (
          <Box>
            <Heading level={2}>fetched designs</Heading>
            <List data={designsFetchedData} pad="none">
              {({ name, url: publishedUrl }) => {
                const { id } = parseUrlParams(publishedUrl);
                const url = `/?id=${encodeURIComponent(id)}`;
                return (
                  <Button
                    key={name}
                    fill
                    plain
                    hoverIndicator
                    href={url}
                    onClick={(event) => {
                      if (!event.ctrlKey && !event.metaKey) {
                        event.preventDefault();
                        window.history.pushState(undefined, undefined, url);
                        onLoadProps({ id });
                      }
                    }}
                  >
                    <Box pad="small">{name}</Box>
                  </Button>
                );
              }}
            </List>
          </Box>
        )}

        <Box>
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
        </Box>

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
      </PageContent>

      <PageContent>
        {readme && (
          <Box flex={false}>
            <Markdown>{readme}</Markdown>
          </Box>
        )}
      </PageContent>

      <PageContent
        background={{ color: 'background-contrast', fill: 'horizontal' }}
      >
        <Box
          flex={false}
          direction="row"
          justify="center"
          gap="medium"
          pad={{ vertical: 'medium' }}
        >
          <RadioButtonGroup
            id="themeMode"
            name="themeMode"
            direction="row"
            gap="medium"
            options={['dark', 'light']}
            value={colorMode || ''}
            onChange={(event) => {
              setColorMode(event.target.value);
            }}
          />
          <CheckBox
            label="right to left"
            checked={rtl || false}
            onChange={() => setRtl(!rtl)}
          />
        </Box>
      </PageContent>

      {manage && (
        <Manage
          onClose={() => {
            setManage(false);
            setDesigns([...designs]); // trigger re-load of offloaded state
          }}
        />
      )}
    </Page>
  );
};

export default Start;
