import React from 'react';
import styled from 'styled-components';
import {
  Box,
  Button,
  CheckBox,
  Header,
  Heading,
  Image,
  Markdown,
  Paragraph,
  RadioButtonGroup,
  Text,
  TextInput,
} from 'grommet';
import { Search } from 'grommet-icons';

const tutorials = [
  {
    title: 'introduction',
    thumb:
      'https://us-central1-grommet-designer.cloudfunctions.net/images/eric-soderberg-hpe-com/designer-tutorial-introduction.png',
    url:
      'https://us-central1-grommet-designer.cloudfunctions.net/images/eric-soderberg-hpe-com/designer%20introduction%202a.mp4',
  },
];

const inspirations = [
  {
    title: 'HPE design system',
    url:
      'https://designer.grommet.io/?id=HPE-design-system-taylor-seamans-hpe-com',
  },
  {
    title: 'Card',
    url: 'https://designer.grommet.io/?id=Card-eric-soderberg-hpe-com',
  },
];

const ThumbnailContainer = styled.div`
  transform: scale(0.25);
  transform-origin: top left;
  pointer-events: none;
`;

const ThumbnailFrame = styled.iframe`
  border: none;
`;

const Thumbnail = ({ title, url }) => {
  const [show, setShow] = React.useState();
  const ref = React.useRef();
  React.useEffect(() => {
    const scroller = ref.current.parentNode.parentNode;
    const update = () => {
      const scrollerRect = scroller.getBoundingClientRect();
      const rect = ref.current.getBoundingClientRect();
      setShow(rect.right > scrollerRect.left && rect.left < scrollerRect.right);
    };
    update();
    let timer;
    const delay = () => {
      clearTimeout(timer);
      timer = setTimeout(update, 1000);
    };
    scroller.addEventListener('scroll', delay);
    return () => {
      scroller.removeEventListener('scroll', delay);
      clearTimeout(timer);
    };
  }, []);

  return (
    <Box ref={ref} gap="xsmall">
      <Box
        width="medium"
        height="small"
        round="xsmall"
        background="background-front"
        overflow="hidden"
      >
        {show && (
          <ThumbnailContainer>
            <ThumbnailFrame
              width="1536"
              height="768"
              title={title}
              src={`${url}&mode=thumb`}
            />
          </ThumbnailContainer>
        )}
      </Box>
      <Text weight="bold" size="large">
        {title}
      </Text>
    </Box>
  );
};

const Start = ({
  chooseDesign,
  colorMode,
  createDesign,
  rtl,
  setColorMode,
  setRtl,
}) => {
  const [designs, setDesigns] = React.useState([]);
  const [readme, setReadme] = React.useState();
  const [search, setSearch] = React.useState();
  const searchRef = React.useRef();

  React.useEffect(() => {
    const stored = localStorage.getItem('designs');
    if (stored) {
      setDesigns(JSON.parse(stored).filter(name => localStorage.getItem(name)));
    }
  }, []);

  React.useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/grommet/grommet-designer/master/README.md',
    ).then(response => {
      if (response.ok) {
        response.text().then(text =>
          setReadme(
            text
              .split('\n')
              .splice(8)
              .join('\n'),
          ),
        );
      }
    });
  }, []);

  React.useLayoutEffect(() => {
    if (search !== undefined && searchRef.current) searchRef.current.focus();
  }, [search]);

  return (
    <Box direction="row-responsive" gap="medium" border="between">
      <Box align="start" pad="large" height="100vh">
        <Heading margin={{ top: 'none' }}>grommet designer</Heading>
        <Paragraph size="xlarge">design with grommet components</Paragraph>
        <Button
          title="create a new design"
          primary
          label="Create"
          href="/_new"
          onClick={event => {
            if (!event.ctrlKey && !event.metaKey) {
              event.preventDefault();
              createDesign();
            }
          }}
        />
        <Box flex />
        <Box
          flex={false}
          direction="row"
          justify="center"
          gap="medium"
          margin={{ top: 'xlarge' }}
        >
          <RadioButtonGroup
            id="themeMode"
            name="themeMode"
            direction="row"
            gap="medium"
            options={['dark', 'light']}
            value={colorMode || ''}
            onChange={event => {
              setColorMode(event.target.value);
            }}
          />
          <CheckBox
            label="right to left"
            checked={rtl || false}
            onChange={() => setRtl(!rtl)}
          />
        </Box>
      </Box>

      <Box flex pad={{ vertical: 'medium', horizontal: 'large' }} gap="large">
        {designs && designs.length > 0 && (
          <Box>
            <Header>
              <Heading level={2}>my designs</Heading>
              {designs.length > 5 && (
                <Box
                  basis="small"
                  flex={false}
                  direction="row"
                  align="center"
                  justify="end"
                >
                  {search !== undefined && (
                    <TextInput
                      ref={searchRef}
                      value={search}
                      onChange={event => setSearch(event.target.value)}
                    />
                  )}
                  <Button
                    icon={<Search />}
                    onClick={() =>
                      setSearch(search !== undefined ? undefined : '')
                    }
                  />
                </Box>
              )}
            </Header>
            <Box direction="row" overflow="auto" gap="medium" border="right">
              {designs
                .filter(
                  name =>
                    !search || name.search(new RegExp(search, 'i')) !== -1,
                )
                .map((name, index) => {
                  const url = `/?name=${encodeURIComponent(name)}`;
                  return (
                    <Button
                      key={name}
                      plain
                      href={`${url}&mode=edit`}
                      onClick={event => {
                        if (!event.ctrlKey && !event.metaKey) {
                          event.preventDefault();
                          chooseDesign(name);
                        }
                      }}
                    >
                      <Thumbnail title={name} url={url} />
                    </Button>
                  );
                })}
            </Box>
          </Box>
        )}

        <Box alignSelf="start">
          <Header alignSelf="stretch">
            <Heading level={2}>tutorials</Heading>
          </Header>
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
        </Box>

        <Box>
          <Heading level={2}>inspiration</Heading>
          <Box direction="row" overflow="auto" gap="medium">
            {inspirations.map(({ title, url }) => (
              <Button key={title} plain href={`${url}&mode=edit`}>
                <Thumbnail title={title} url={url} />
              </Button>
            ))}
          </Box>
        </Box>

        {readme && (
          <Box>
            <Markdown>{readme}</Markdown>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Start;
