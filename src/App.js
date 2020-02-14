import React from 'react';
import ReactGA from 'react-ga';
import { Grommet, Grid, Keyboard, ResponsiveContext, grommet } from 'grommet';
import ErrorCatcher from './ErrorCatcher';
import Canvas from './Canvas';
import Properties from './Properties/Properties';
import Tree from './Tree/Tree';
import {
  apiUrl,
  getInitialSelected,
  getScreenByPath,
  setupDesign,
  upgradeDesign,
  themeApiUrl,
  bare,
  loading,
} from './design';
import ScreenDetails from './Properties/ScreenDetails';
import themes from './themes';
import designerLibrary from './libraries/designer';
import grommetLibrary from './libraries/grommet';

const designerTheme = {
  ...grommet,
  global: {
    ...grommet.global,
    colors: { background: { dark: '#282828', light: '#f8f8f8' } },
  },
};

const getParams = () => {
  const { location } = window;
  const params = {};
  location.search
    .slice(1)
    .split('&')
    .forEach(p => {
      const [k, v] = p.split('=');
      params[k] = decodeURIComponent(v);
    });
  return params;
};

const App = () => {
  const responsive = React.useContext(ResponsiveContext);
  const [design, setDesign] = React.useState(setupDesign(loading));
  const [selected, setSelected] = React.useState(getInitialSelected(design));
  const [base, setBase] = React.useState();
  const [theme, setTheme] = React.useState();
  const [colorMode, setColorMode] = React.useState('dark');
  const [rtl, setRTL] = React.useState();
  const [preview, setPreview] = React.useState(true);
  const [changes, setChanges] = React.useState([]);
  const [changeIndex, setChangeIndex] = React.useState();
  const [designs, setDesigns] = React.useState([]);
  const [libraries, setLibraries] = React.useState([
    grommetLibrary,
    designerLibrary,
  ]);
  const selectedComponent = React.useMemo(
    () =>
      selected.component ? design.components[selected.component] : undefined,
    [design, selected],
  );

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

    if (params.id) {
      fetch(`${apiUrl}/${params.id}`)
        .then(response => response.json())
        .then(nextDesign => {
          upgradeDesign(nextDesign);
          const screen =
            (pathname && getScreenByPath(nextDesign, pathname)) ||
            nextDesign.screenOrder[0];
          const nextSelected = { screen };
          setDesign(nextDesign);
          setSelected(nextSelected);
          setChanges([{ design: nextDesign, selected: nextSelected }]);
          setChangeIndex(0);
          ReactGA.event({
            category: 'switch',
            action: 'published design',
          });
        });
    } else {
      let nextDesign;
      let nextSelected;
      if (pathname === '/_new') {
        nextDesign = setupDesign(bare);
        ReactGA.event({
          category: 'switch',
          action: 'force new design',
        });
      } else {
        let stored = localStorage.getItem('activeDesign');
        if (stored) {
          stored = localStorage.getItem(stored);
        }
        if (stored) {
          nextDesign = JSON.parse(stored);
          stored = localStorage.getItem('selected');
          if (stored) nextSelected = JSON.parse(stored);
          ReactGA.event({
            category: 'switch',
            action: 'previous design',
          });
        } else {
          nextDesign = setupDesign(bare);
          ReactGA.event({
            category: 'switch',
            action: 'new design',
          });
        }
      }

      upgradeDesign(nextDesign);

      if (!nextSelected) {
        const screen =
          pathname && pathname !== '/_new'
            ? getScreenByPath(nextDesign, pathname)
            : nextDesign.screenOrder[0];
        const component = nextDesign.screens[screen].root;
        nextSelected = { screen, component };
      }

      setDesign(nextDesign);
      setSelected(nextSelected);
      setPreview(false);
      setChanges([{ design: nextDesign, selected: nextSelected }]);
      setChangeIndex(0);
    }
  }, []);

  React.useEffect(() => {
    const stored = localStorage.getItem('designs');
    if (stored) setDesigns(JSON.parse(stored));
  }, []);

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
    const stored = localStorage.getItem('preview');
    if (stored) setPreview(JSON.parse(stored));
  }, []);

  // browser navigation

  // react when user uses browser back and forward buttons
  React.useEffect(() => {
    const onPopState = () => {
      const {
        location: { pathname },
      } = document;
      const screen = getScreenByPath(design, pathname);
      if (screen)
        setSelected({ screen, component: design.screens[screen].root });
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [design]);

  // push state when the user navigates
  React.useEffect(() => {
    const {
      location: { pathname },
    } = document;
    // track selected screen in browser location, so browser
    // backward/forward controls work
    const screen = design.screens[selected.screen];
    if (screen && screen.path !== pathname) {
      window.history.pushState(undefined, undefined, screen.path);
    }
  }, [design, selected.screen]);

  // store design
  React.useEffect(() => {
    // do this stuff lazily, so we don't bog down the UI
    const timer = setTimeout(() => {
      document.title = design.name;

      localStorage.setItem(design.name, JSON.stringify(design));
      localStorage.setItem('activeDesign', design.name);

      if (!designs.includes(design.name)) {
        const nextDesigns = [design.name, ...designs];
        localStorage.setItem('designs', JSON.stringify(nextDesigns));
        setDesigns(nextDesigns);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [design, designs]);

  // setup libraries
  React.useEffect(() => {
    if (design.library) {
      Object.keys(design.library).forEach(name => {
        const url = design.library[name];
        if (name && url && !document.getElementById(name)) {
          // add library
          const script = document.createElement('script');
          script.src = url;
          script.id = name;
          document.body.appendChild(script);
          script.onload = () =>
            setLibraries([window[name].designer, ...libraries]);
        }
      });
    }
  }, [design.library, libraries]);

  // setup base
  React.useEffect(() => {
    if (design.base && !base) {
      const id = design.base.split('id=')[1];
      fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(nextBase => {
          setBase(nextBase);
          const nextDesign = JSON.parse(JSON.stringify(design));
          nextDesign.theme = nextBase.theme;
          setDesign(nextDesign);
        });
    } else if (base && !design.base) {
      setBase(undefined);
    }
  }, [base, design]);

  // setup theme
  React.useEffect(() => {
    const nextTheme = design.theme;
    if (typeof nextTheme === 'string') {
      if (nextTheme.slice(0, 4) === 'http') {
        // extract id from URL
        const id = nextTheme.split('id=')[1];
        if (id) {
          fetch(`${themeApiUrl}/${id}`)
            .then(response => response.json())
            .then(setTheme);
        }
      } else setTheme(themes[nextTheme] || grommet);
    } else if (typeof nextTheme === 'object') {
      setTheme(nextTheme);
    } else {
      setTheme(grommet);
    }
  }, [design.theme]);

  // store selected
  React.useEffect(() => {
    localStorage.setItem('selected', JSON.stringify(selected));
  }, [selected]);

  // add to changes, if needed
  React.useEffect(() => {
    // do this stuff lazily to ride out typing sprees
    const timer = setTimeout(() => {
      // If we already have this design object, we must be doing an undo or
      // redo, and therefore no need to add a change
      if (!changes.some(c => c.design === design)) {
        let nextChanges;
        nextChanges = [...changes];
        nextChanges = nextChanges.slice(changeIndex, 10);
        nextChanges.unshift({ design, selected });
        setChanges(nextChanges);
        setChangeIndex(0);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [changes, changeIndex, design, selected]);

  // persist preview state when it changes
  React.useEffect(() => {
    localStorage.setItem('preview', JSON.stringify(preview));
    // trigger resize so rendered elements can respond accordingly
    window.dispatchEvent(new Event('resize'));
  }, [preview]);

  const onKey = React.useCallback(
    event => {
      if (event.metaKey) {
        if (event.key === 'e' || event.key === 'E') {
          event.preventDefault();
          setPreview(!preview);
        }
      }
    },
    [preview],
  );

  const onUndo = React.useCallback(() => {
    const nextChangeIndex = Math.min(changeIndex + 1, changes.length - 1);
    const { design: nextDesign, selected: nextSelected } = changes[
      nextChangeIndex
    ];
    setDesign(nextDesign);
    setSelected(nextSelected);
    setChangeIndex(nextChangeIndex);
  }, [changes, changeIndex]);

  const onRedo = React.useCallback(() => {
    const nextChangeIndex = Math.max(changeIndex - 1, 0);
    const { design: nextDesign, selected: nextSelected } = changes[
      nextChangeIndex
    ];
    setDesign(nextDesign);
    setSelected(nextSelected);
    setChangeIndex(nextChangeIndex);
  }, [changes, changeIndex]);

  return (
    <Grommet
      full
      theme={designerTheme}
      themeMode={colorMode}
      dir={rtl ? 'rtl' : undefined}
    >
      <Keyboard target="document" onKeyDown={onKey}>
        <Grid
          fill
          columns={
            responsive === 'small' || preview
              ? 'flex'
              : [
                  ['small', '288px'],
                  ['1/2', 'flex'],
                  ['small', 'medium'],
                ]
          }
        >
          {responsive !== 'small' && !preview && (
            <Tree
              design={design}
              libraries={libraries}
              base={base}
              rtl={rtl}
              selected={selected}
              theme={theme}
              colorMode={colorMode}
              setColorMode={setColorMode}
              setDesign={setDesign}
              setRTL={setRTL}
              setSelected={setSelected}
              onRedo={changeIndex > 0 && onRedo}
              onUndo={changeIndex < changes.length - 1 && onUndo}
            />
          )}

          <ErrorCatcher>
            <Canvas
              design={theme ? design : setupDesign(loading)}
              libraries={libraries}
              selected={selected}
              preview={preview}
              setDesign={setDesign}
              setSelected={setSelected}
              theme={theme}
            />
          </ErrorCatcher>

          {responsive !== 'small' &&
            !preview &&
            (!selectedComponent ? (
              <ScreenDetails
                design={design}
                selected={selected}
                setDesign={setDesign}
                setSelected={setSelected}
              />
            ) : (
              <Properties
                design={design}
                libraries={libraries}
                theme={theme}
                selected={selected}
                component={selectedComponent}
                setDesign={setDesign}
                setSelected={setSelected}
              />
            ))}
        </Grid>
      </Keyboard>
    </Grommet>
  );
};

export default App;
