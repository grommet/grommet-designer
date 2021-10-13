import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import {
  Box,
  Button,
  Form,
  Grommet,
  Paragraph,
  Text,
  TextInput,
  grommet,
} from 'grommet';
import { Next } from 'grommet-icons';
import Designer from './Designer';
import Loading from './Loading';
import Start from './Start';
import { loadDesign } from './design/load';
import { parseUrlParams } from './utils';

const designerTheme = {
  ...grommet,
  global: {
    ...grommet.global,
    colors: { background: { dark: '#282828', light: '#f8f8f8' } },
    drop: {
      zIndex: 300,
    },
  },
  // so designer layers are on top of Canvas layers
  // HPE theme uses 110 due to common header, so need to higher
  layer: {
    ...grommet.layer,
    zIndex: 300,
  },
  tip: {
    content: {
      background: 'background',
    },
  },
};

const setUrl = (design, method = 'push') => {
  const url = design
    ? `${window.location.pathname}?name=${encodeURIComponent(design.name)}`
    : '/';
  if (method === 'replace')
    window.history.replaceState(undefined, undefined, url);
  else window.history.pushState(undefined, undefined, url);
};

const App = () => {
  const [start, setStart] = useState();
  const [error, setError] = useState();
  const [auth, setAuth] = useState();
  const [password, setPassword] = useState();
  const [subsequent, setSubsequent] = useState();
  const [design, setDesign] = useState();
  const [colorMode, setColorMode] = useState('dark');
  const [rtl, setRtl] = useState();
  const [needSave, setNeedSave] = useState(0);

  // initialize analytics
  useEffect(() => {
    if (window.location.host !== 'localhost') {
      const {
        location: { pathname },
      } = window;
      ReactGA.initialize('UA-99690204-4');
      ReactGA.pageview(pathname);
    }
  }, []);

  // load initial design
  useEffect(() => {
    const {
      location: { pathname },
    } = window;
    const params = parseUrlParams(window.location.search);
    const options = {
      initial: true,
      onAuth: () =>
        setAuth(password ? "Hmm, that password didn't work." : true),
      onLoad: (nextDesign) => {
        if (nextDesign.subsequentPublish) {
          setSubsequent({
            local: nextDesign,
            published: nextDesign.subsequentPublish,
          });
          delete nextDesign.subsequentPublish;
        } else {
          setDesign(nextDesign);

          if (!nextDesign.local && nextDesign.publishedUrl) {
            // remember a bit about this design so we can find it again if needed
            const stored = localStorage.getItem('designs-fetched');
            const designsFetched = stored ? JSON.parse(stored) : [];
            const index = designsFetched.findIndex(
              ({ name }) => name === nextDesign.name,
            );
            if (index !== 0) {
              const nextDesignsFetched = [...designsFetched];
              if (index !== -1) nextDesignsFetched.splice(index, 1);
              nextDesignsFetched.unshift({
                name: nextDesign.name,
                url: nextDesign.publishedUrl,
              });
              localStorage.setItem(
                'designs-fetched',
                JSON.stringify(nextDesignsFetched),
              );
            }
          }
        }
      },
      onError: (message) => setError(message),
    };
    if (pathname === '/_new' || params.new) options.fresh = true;
    else if (params.id) options.id = params.id;
    else if (params.name) options.name = params.name;
    else {
      setStart(true);
      return;
    }
    if (password) options.password = password;
    loadDesign(options);
  }, [password]);

  useEffect(() => {
    const stored = localStorage.getItem('colorMode');
    if (stored) setColorMode(stored);
    else if (window.matchMedia) {
      setColorMode(
        window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light',
      );
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (needSave) {
        const params = parseUrlParams(window.location.search);
        if (params.name !== design.name) setUrl(design, 'replace');
        const stored = localStorage.getItem('designs');
        const designs = stored ? JSON.parse(stored) : [];
        const index = designs.indexOf(design.name);
        if (index !== 0) {
          const nextDesigns = [...designs];
          if (index !== -1) nextDesigns.splice(index, 1);
          nextDesigns.unshift(design.name);
          localStorage.setItem('designs', JSON.stringify(nextDesigns));
        }
        setNeedSave(0);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [design, needSave]);

  let content;
  if (error) {
    content = (
      <Box fill align="center" justify="center">
        <Paragraph size="xlarge" textAlign="center">
          {error}
        </Paragraph>
      </Box>
    );
  } else if (auth) {
    content = (
      <Box fill align="center" justify="center">
        <Form
          onSubmit={({ value: { password: nextPassword } }) => {
            setPassword(nextPassword);
            setAuth(false);
          }}
        >
          <Box direction="row" gap="medium">
            <TextInput
              size="large"
              name="password"
              placeholder="password"
              type="password"
              onChange={() => setAuth(true)}
            />
            <Button type="submit" icon={<Next />} hoverIndicator />
          </Box>
          <Box pad="small">
            <Text>{typeof auth === 'string' ? auth : ''}&nbsp;</Text>
          </Box>
        </Form>
      </Box>
    );
  } else if (subsequent) {
    const { local, published } = subsequent;
    const publishDate = new Date(published.date);
    const localDate = new Date(local.date);
    let options;
    if (publishDate.getUTCFullYear() !== localDate.getUTCFullYear()) {
      options = { year: 'numeric' };
    } else if (publishDate.getUTCMonth() !== localDate.getUTCMonth()) {
      options = { month: 'long' };
    } else if (publishDate.getUTCDate() !== localDate.getUTCDate()) {
      options = { month: 'short', day: 'numeric' };
    } else {
      options = { hour: 'numeric', minute: '2-digit' };
    }

    content = (
      <Box fill align="center" justify="center" pad="large">
        <Paragraph size="large" textAlign="center">
          A newer published version of this design has been detected. Which one
          would you like to use?
        </Paragraph>
        <Box direction="row" align="center" gap="medium">
          <Button
            label={`use published ${publishDate.toLocaleString(
              undefined,
              options,
            )}`}
            onClick={() => {
              setSubsequent(undefined);
              // keep the published one
              published.local = true;
              setDesign(published);
            }}
          />
          <Button
            label={`use current local ${localDate.toLocaleString(
              undefined,
              options,
            )}`}
            onClick={() => {
              setSubsequent(undefined);
              setDesign(local);
            }}
          />
        </Box>
      </Box>
    );
  } else if (design) {
    content = (
      <Designer
        design={design}
        chooseDesign={(design) => {
          if (!design) setStart(true);
          setDesign(design);
          setUrl(design);
        }}
        updateDesign={(design) => {
          setDesign(design);
          setNeedSave(needSave + 1);
        }}
      />
    );
  } else if (start) {
    content = (
      <Start
        chooseDesign={(args) => {
          loadDesign({
            ...args,
            onLoad: (nextDesign) => {
              if (nextDesign.subsequentPublish) {
                setSubsequent({
                  local: nextDesign,
                  published: nextDesign.subsequentPublish,
                });
                delete nextDesign.subsequentPublish;
              } else {
                setDesign(nextDesign);
                setUrl(nextDesign);
              }
            },
          });
        }}
        colorMode={colorMode}
        createDesign={() => {
          loadDesign({
            fresh: true,
            onLoad: (nextDesign) => {
              setDesign(nextDesign);
              window.history.pushState(undefined, undefined, '/?new');
            },
          });
        }}
        importDesign={(jsonDesign) => {
          loadDesign({
            json: jsonDesign,
            onLoad: (nextDesign) => {
              if (nextDesign.subsequentPublish) {
                setSubsequent({
                  local: nextDesign,
                  published: nextDesign.subsequentPublish,
                });
                delete nextDesign.subsequentPublish;
              } else {
                setDesign(nextDesign);
                setUrl(nextDesign);
              }
            },
          });
        }}
        rtl={rtl}
        setColorMode={setColorMode}
        setRtl={setRtl}
      />
    );
  } else {
    content = <Loading />;
  }

  return (
    <Grommet
      theme={designerTheme}
      themeMode={colorMode}
      dir={rtl ? 'rtl' : undefined}
      style={{ height: '100%' }}
    >
      {content}
    </Grommet>
  );
};

export default App;
