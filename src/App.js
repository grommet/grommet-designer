import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactGA from 'react-ga';
import { Grommet, grommet } from 'grommet';
import AppContext from './AppContext';
import Designer from './Designer';
import Loading from './Loading';
import Start from './Start';
import NewDesign from './NewDesign';
import { parseUrlParams } from './utils';
import { useTheme } from './design2';

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
  const [loadProps, setLoadProps] = useState();
  const [appSettings, setAppSettings] = useState({});
  const [thumb, setThumb] = useState();
  const designTheme = useTheme();

  const designerTheme = useMemo(() => {
    const baseTheme = designTheme || grommet;
    return {
      ...baseTheme,
      global: {
        ...baseTheme.global,
        colors: { background: { dark: '#282828', light: '#f8f8f8' } },
        drop: {
          zIndex: 300,
        },
      },
      // so designer layers are on top of Canvas layers
      // HPE theme uses 110 due to common header, so need to higher
      layer: {
        ...baseTheme.layer,
        zIndex: 300,
      },
      tip: {
        content: {
          background: 'background',
        },
      },
    };
  }, [designTheme]);

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

  const onClose = useCallback(() => {
    setLoadProps(undefined);
    setStart(true);
  }, []);

  let content;
  if (loadProps) {
    content = (
      <Designer loadProps={loadProps} onClose={onClose} thumb={thumb} />
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
