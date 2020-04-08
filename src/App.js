import React from 'react';
import ReactGA from 'react-ga';
import { Box, Button, Form, Grommet, TextInput, grommet } from 'grommet';
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
  const [auth, setAuth] = React.useState();
  const [password, setPassword] = React.useState();
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
      onLoad: setDesign,
      // onLoad: nextDesign => {
      //   let nextSelected;
      //   if (params.id) {
      //     const screen =
      //       (pathname && getScreenByPath(nextDesign, pathname)) ||
      //       nextDesign.screenOrder[0];
      //     nextSelected = { screen };
      //   } else {
      //     const stored = localStorage.getItem('selected');
      //     if (stored) nextSelected = JSON.parse(stored);
      //     else {
      //       const screen =
      //         (pathname &&
      //           pathname !== '/_new' &&
      //           getScreenByPath(nextDesign, pathname)) ||
      //         nextDesign.screenOrder[0];
      //       const component = nextDesign.screens[screen].root;
      //       nextSelected = { screen, component };
      //     }
      //   }
      //   setLoad(prevLoad => ({
      //     ...prevLoad,
      //     design: nextDesign,
      //     selected: nextSelected,
      //   }));

      //   loadTheme(nextDesign.theme, nextTheme => {
      //     setLoad(prevLoad => ({ ...prevLoad, theme: nextTheme }));
      //   });

      //   let loadingImports = [...defaultImports, ...(nextDesign.imports || [])];
      //   setLoad(prevLoad => ({ ...prevLoad, imports: loadingImports }));
      //   loadImports(loadingImports, f => {
      //     loadingImports = f(loadingImports);
      //     setLoad(prevLoad => ({ ...prevLoad, imports: loadingImports }));
      //   });

      //   let nextMode;
      //   if (params.preview && JSON.parse(params.preview)) nextMode = 'preview';
      //   else if (params.comments && JSON.parse(params.comments))
      //     nextMode = 'comments';
      //   else if (params.mode) nextMode = params.mode;
      //   else if (!!params.id) nextMode = 'preview';
      //   else if (pathname === '/_new') nextMode = 'edit';
      //   else {
      //     let stored = localStorage.getItem('preview');
      //     if (stored && JSON.parse(stored)) nextMode = 'preview';
      //     stored = localStorage.getItem('designerMode');
      //     if (stored) nextMode = JSON.parse(stored);
      //     if (!nextMode) nextMode = 'edit';
      //   }
      //   setLoad(prevLoad => ({ ...prevLoad, mode: nextMode }));
      // },
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
  if (auth) {
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
              setDesign(nextDesign);
              setNameParam(nextDesign.name);
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
      full
      theme={designerTheme}
      themeMode={colorMode}
      dir={rtl ? 'rtl' : undefined}
    >
      {content}
    </Grommet>
  );
};

export default App;
