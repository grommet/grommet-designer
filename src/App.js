import React from 'react';
import ReactGA from 'react-ga';
import {
  Box,
  Button,
  Form,
  Grommet,
  Paragraph,
  TextInput,
  grommet,
} from 'grommet';
import { Next } from 'grommet-icons';
import Designer from './Designer';
import Loading from './Loading';
import Start from './Start';
import { loadDesign } from './design/load';
import { getParams } from './utils';

const designerTheme = {
  ...grommet,
  global: {
    ...grommet.global,
    colors: { background: { dark: '#282828', light: '#f8f8f8' } },
  },
  // so designer layers are on top of Canvas layers
  layer: {
    ...grommet.layer,
    zIndex: 15,
  },
};

const setNameParam = name => {
  const search = `?name=${encodeURIComponent(name)}`;
  const url = window.location.pathname + search;
  window.history.replaceState(undefined, undefined, url);
};

const App = () => {
  const [start, setStart] = React.useState();
  const [error, setError] = React.useState();
  const [auth, setAuth] = React.useState();
  const [password, setPassword] = React.useState();
  const [subsequent, setSubsequent] = React.useState();
  const readOnly = React.useMemo(() => {
    const params = getParams();
    return params.mode === 'thumb';
  }, []);
  const [design, setDesign] = React.useState();
  const [colorMode, setColorMode] = React.useState('dark');
  const [rtl, setRtl] = React.useState();

  // initialize analytics
  React.useEffect(() => {
    if (window.location.host !== 'localhost') {
      const {
        location: { pathname },
      } = window;
      ReactGA.initialize('UA-99690204-4');
      ReactGA.pageview(pathname);
    }
  }, []);

  // load initial design
  React.useEffect(() => {
    const {
      location: { pathname },
    } = window;
    const params = getParams();
    const options = {
      initial: true,
      onAuth: () => setAuth(true),
      onLoad: nextDesign => {
        if (nextDesign.subsequentPublish) {
          setSubsequent({
            local: nextDesign,
            published: nextDesign.subsequentPublish,
          });
          delete nextDesign.subsequentPublish;
        } else {
          setDesign(nextDesign);
        }
      },
      onError: message => setError(message),
    };
    if (pathname === '/_new') options.fresh = true;
    else if (params.id) options.id = params.id;
    else if (params.name) options.name = params.name;
    else {
      setStart(true);
      return;
    }
    if (password) options.password = password;
    loadDesign(options);
  }, [password]);

  React.useEffect(() => {
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

  React.useEffect(() => {
    if (design && design.local && !readOnly) {
      const timer = setTimeout(() => {
        if (design.local) {
          const params = getParams();
          if (params.name !== design.name) setNameParam(design.name);
          const stored = localStorage.getItem('designs');
          const designs = stored ? JSON.parse(stored) : [];
          const index = designs.indexOf(design.name);
          if (index !== 0) {
            const nextDesigns = [...designs];
            if (index !== -1) nextDesigns.splice(index, 1);
            nextDesigns.unshift(design.name);
            localStorage.setItem('designs', JSON.stringify(nextDesigns));
          }
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [design, readOnly]);

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
            />
            <Button type="submit" icon={<Next />} hoverIndicator />
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
        setDesign={design => {
          if (!design) {
            setStart(true);
            window.history.replaceState(undefined, undefined, '/');
          }
          setDesign(design);
        }}
      />
    );
  } else if (start) {
    content = (
      <Start
        chooseDesign={name => {
          loadDesign({
            name,
            onLoad: nextDesign => {
              if (nextDesign.subsequentPublish) {
                setSubsequent({
                  local: nextDesign,
                  published: nextDesign.subsequentPublish,
                });
                delete nextDesign.subsequentPublish;
              } else {
                setDesign(nextDesign);
                setNameParam(nextDesign.name);
              }
            },
          });
        }}
        colorMode={colorMode}
        createDesign={() => {
          loadDesign({
            fresh: true,
            onLoad: nextDesign => {
              // pick an unused initial name
              nextDesign.name = 'new design';
              setDesign(nextDesign);
              window.history.replaceState(undefined, undefined, '/_new');
            },
          });
        }}
        importDesign={jsonDesign => {
          loadDesign({
            json: jsonDesign,
            onLoad: nextDesign => {
              if (nextDesign.subsequentPublish) {
                setSubsequent({
                  local: nextDesign,
                  published: nextDesign.subsequentPublish,
                });
                delete nextDesign.subsequentPublish;
              } else {
                setDesign(nextDesign);
                setNameParam(nextDesign.name);
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
