import React, { useEffect, useMemo, useState } from 'react';
import ReactGA from 'react-ga';
import { Grommet, grommet } from 'grommet';
import AppContext from './AppContext';
import Designer from './Designer';
import Loading from './Loading';
import Start from './Start';
import NewDesign from './NewDesign';
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

const calculateGrommetThemeMode = (themeMode) =>
  (themeMode === 'auto' &&
    window.matchMedia &&
    (window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light')) ||
  themeMode;

const App = () => {
  const [start, setStart] = useState();
  const [newDesign, setNewDesign] = useState();
  // const [subsequent, setSubsequent] = useState();
  const [loadProps, setLoadProps] = useState();
  const [appSettings, setAppSettings] = useState({});
  const [thumb, setThumb] = useState();

  const appContextValue = useMemo(
    () => ({
      ...appSettings,
      setThemeMode: (nextThemeMode) => {
        const nextAppSettings = {
          ...appSettings,
          themeMode: nextThemeMode,
          grommetThemeMode: calculateGrommetThemeMode(nextThemeMode),
        };
        setAppSettings(nextAppSettings);
        localStorage.setItem('_settings', JSON.stringify(nextAppSettings));
      },
      setDirection: (nextDirection) => {
        const nextAppSettings = { ...appSettings, direction: nextDirection };
        setAppSettings(nextAppSettings);
        localStorage.setItem('_settings', JSON.stringify(nextAppSettings));
      },
    }),
    [appSettings],
  );

  // initialize app context from storage
  useEffect(() => {
    const stored = localStorage.getItem('_settings');
    if (stored) {
      const nextAppSettings = JSON.parse(stored);
      nextAppSettings.grommetThemeMode = calculateGrommetThemeMode(
        nextAppSettings.themeMode,
      );
      setAppSettings(nextAppSettings);
    }
  }, []);

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

  // initialize state from URL
  useEffect(() => {
    const {
      location: { pathname },
    } = window;
    const params = parseUrlParams(window.location.search);
    if (params.mode && params.mode === 'thumb') setThumb(true);
    if (pathname === '/_new' || params.new) setNewDesign(true);
    else if (params.name) setLoadProps({ name: params.name });
    else if (params.id) setLoadProps({ id: params.id });
    else setStart(true);
  }, []);

  let content;
  // if (subsequent) {
  //   const { local, published } = subsequent;
  //   const publishDate = new Date(published.date);
  //   const localDate = new Date(local.date);
  //   let options;
  //   if (publishDate.getUTCFullYear() !== localDate.getUTCFullYear()) {
  //     options = { year: 'numeric' };
  //   } else if (publishDate.getUTCMonth() !== localDate.getUTCMonth()) {
  //     options = { month: 'long' };
  //   } else if (publishDate.getUTCDate() !== localDate.getUTCDate()) {
  //     options = { month: 'short', day: 'numeric' };
  //   } else {
  //     options = { hour: 'numeric', minute: '2-digit' };
  //   }

  //   content = (
  //     <Box fill align="center" justify="center" pad="large">
  //       <Paragraph size="large" textAlign="center">
  //         A newer published version of this design has been detected. Which one
  //         would you like to use?
  //       </Paragraph>
  //       <Box direction="row" align="center" gap="medium">
  //         <Button
  //           label={`use published ${publishDate.toLocaleString(
  //             undefined,
  //             options,
  //           )}`}
  //           onClick={() => {
  //             setSubsequent(undefined);
  //             // keep the published one
  //             published.local = true;
  //             setDesign(published);
  //           }}
  //         />
  //         <Button
  //           label={`use current local ${localDate.toLocaleString(
  //             undefined,
  //             options,
  //           )}`}
  //           onClick={() => {
  //             setSubsequent(undefined);
  //             setDesign(local);
  //           }}
  //         />
  //       </Box>
  //     </Box>
  //   );
  if (loadProps) {
    content = (
      <Designer
        loadProps={loadProps}
        onClose={() => {
          setLoadProps(undefined);
          setStart(true);
        }}
        thumb={thumb}
      />
    );
  } else if (newDesign) {
    content = (
      <NewDesign
        onClose={() => {
          setNewDesign(false);
          setStart(true);
        }}
        onLoadProps={(props) => {
          setNewDesign(false);
          setLoadProps(props);
        }}
      />
    );
  } else if (start) {
    content = (
      <Start
        onNew={() => setNewDesign(true)}
        onLoadProps={(props) => {
          setStart(false);
          setLoadProps(props);
        }}
      />
    );
  } else {
    content = <Loading />;
  }

  return (
    <AppContext.Provider value={appContextValue}>
      <Grommet
        theme={designerTheme}
        themeMode={appSettings.grommetThemeMode}
        dir={appSettings.direction}
      >
        {content}
      </Grommet>
    </AppContext.Provider>
  );
};

export default App;
