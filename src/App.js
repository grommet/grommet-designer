import React from 'react';
import ReactGA from 'react-ga';
import {
  Box,
  Button,
  Form,
  Grommet,
  Grid,
  Keyboard,
  ResponsiveContext,
  TextInput,
  grommet,
} from 'grommet';
import { Next } from 'grommet-icons';
import ErrorCatcher from './ErrorCatcher';
import Canvas from './Canvas';
import Properties from './Properties/Properties';
import Tree from './Tree/Tree';
import Comments from './Comments/Comments';
import {
  getInitialSelected,
  getScreenByPath,
  setupDesign,
  loading,
  publish,
} from './design';
import ScreenDetails from './Properties/ScreenDetails';
import designerLibrary from './libraries/designer';
import grommetLibrary from './libraries/grommet';
import { loadDesign, loadImports, loadTheme } from './design/load';

const designerTheme = {
  ...grommet,
  global: {
    ...grommet.global,
    colors: { background: { dark: '#282828', light: '#f8f8f8' } },
  },
};

const defaultImports = [
  { name: grommetLibrary.name, library: grommetLibrary },
  { name: designerLibrary.name, library: designerLibrary },
];

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
  // In the worst case, we need to load a published design, a published theme,
  // and any imports. We load theme as we go into the 'load'
  // state. When they're all ready, we update all of the necessary states.
  const [load, setLoad] = React.useState({});
  const [auth, setAuth] = React.useState();
  const [password, setPassword] = React.useState();
  const [design, setDesign] = React.useState(setupDesign(loading));
  const [selected, setSelected] = React.useState(getInitialSelected(design));
  const [imports, setImports] = React.useState(defaultImports);
  const libraries = React.useMemo(
    () => imports.filter(i => i.library).map(i => i.library),
    [imports],
  );
  const [theme, setTheme] = React.useState(grommet);
  const [colorMode, setColorMode] = React.useState('dark');
  const [rtl, setRTL] = React.useState();
  const [mode, setMode] = React.useState();
  const [changes, setChanges] = React.useState([]);
  const [changeIndex, setChangeIndex] = React.useState();
  const [designs, setDesigns] = React.useState([]);
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
    const options = {
      initial: true,
      onAuth: () => setAuth(true),
      onLoad: nextDesign => {
        let nextSelected;
        if (params.id) {
          const screen =
            (pathname && getScreenByPath(nextDesign, pathname)) ||
            nextDesign.screenOrder[0];
          nextSelected = { screen };
        } else {
          const stored = localStorage.getItem('selected');
          if (stored) nextSelected = JSON.parse(stored);
          else {
            const screen =
              (pathname &&
                pathname !== '/_new' &&
                getScreenByPath(nextDesign, pathname)) ||
              nextDesign.screenOrder[0];
            const component = nextDesign.screens[screen].root;
            nextSelected = { screen, component };
          }
        }
        setLoad(prevLoad => ({
          ...prevLoad,
          design: nextDesign,
          selected: nextSelected,
        }));

        loadTheme(nextDesign.theme, nextTheme => {
          setLoad(prevLoad => ({ ...prevLoad, theme: nextTheme }));
        });

        let loadingImports = [...defaultImports, ...(nextDesign.imports || [])];
        setLoad(prevLoad => ({ ...prevLoad, imports: loadingImports }));
        loadImports(loadingImports, f => {
          loadingImports = f(loadingImports);
          setLoad(prevLoad => ({ ...prevLoad, imports: loadingImports }));
        });

        let nextMode;
        if (params.preview && JSON.parse(params.preview)) nextMode = 'preview';
        else if (params.comments && JSON.parse(params.comments))
          nextMode = 'comments';
        else if (params.mode) nextMode = params.mode;
        else if (!!params.id) nextMode = 'preview';
        else if (pathname === '/_new') nextMode = 'edit';
        else {
          let stored = localStorage.getItem('preview');
          if (stored && JSON.parse(stored)) nextMode = 'preview';
          stored = localStorage.getItem('designerMode');
          if (stored) nextMode = JSON.parse(stored);
          if (!nextMode) nextMode = 'edit';
        }
        setLoad(prevLoad => ({ ...prevLoad, mode: nextMode }));
      },
    };
    if (pathname === '/_new') options.fresh = true;
    else if (params.id) options.id = params.id;
    else if (params.name) options.name = params.name;
    if (password) options.password = password;
    loadDesign(options);
  }, [password]);

  // finish loading
  React.useEffect(() => {
    if (
      load &&
      load.design &&
      load.selected &&
      load.theme &&
      load.imports &&
      !load.imports.some(i => i.url && !(i.design || i.library))
    ) {
      setImports(load.imports);
      setTheme(load.theme);
      setDesign(load.design);
      setSelected(load.selected);
      setMode(load.mode);
      setChanges([{ design: load.design, selected: load.selected }]);
      setChangeIndex(0);
      setLoad(undefined);
    }
  }, [load]);

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
    if (!load) {
      const {
        location: { pathname },
      } = document;
      // track selected screen in browser location, so browser
      // backward/forward controls work
      const screen = design.screens[selected.screen];
      if (screen && screen.path !== pathname) {
        window.history.pushState(
          undefined,
          undefined,
          screen.path + window.location.search,
        );
      }
    }
  }, [design, load, selected.screen]);

  // store design
  React.useEffect(() => {
    if (!load) {
      // do this stuff lazily, so we don't bog down the UI
      const timer = setTimeout(() => {
        document.title = design.name;
        const date = new Date();
        date.setMilliseconds(0);
        design.date = date.toISOString();

        localStorage.setItem(design.name, JSON.stringify(design));

        if (!designs.includes(design.name)) {
          const nextDesigns = [design.name, ...designs];
          localStorage.setItem('designs', JSON.stringify(nextDesigns));
          setDesigns(nextDesigns);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [design, designs, load]);

  // align imports with design.imports
  React.useEffect(() => {
    if (!load) {
      // remove any imports we don't want anymore
      const nextImports = imports.filter(
        ({ url }) =>
          !url || design.imports.findIndex(i => i.url === url) !== -1,
      );
      let changed = nextImports.length !== imports.length;
      // add any imports we don't have yet
      design.imports.forEach(({ url }) => {
        if (nextImports.findIndex(i => i.url === url) === -1) {
          nextImports.push({ url });
          changed = true;
        }
      });
      if (changed) setImports(nextImports);
    }
  }, [design.imports, imports, load]);

  // load any imports we don't have yet
  React.useEffect(() => {
    if (!load) {
      loadImports(imports, f => {
        const nextImports = f(imports);
        setImports(nextImports);
      });
    }
  }, [imports, load]);

  // update theme
  React.useEffect(() => {
    if (!load) loadTheme(design.theme, setTheme);
  }, [design.theme, load]);

  // store selected
  React.useEffect(() => {
    localStorage.setItem('selected', JSON.stringify(selected));
  }, [selected]);

  const changeDesign = nextDesign => {
    if (nextDesign.fetched) {
      nextDesign.derivedFromId = nextDesign.id;
      delete nextDesign.fetched;
    }
    setDesign(nextDesign);
  };

  // add to changes, if needed
  React.useEffect(() => {
    if (!load) {
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
    }
  }, [changes, changeIndex, design, load, selected]);

  // persist mode when it changes
  React.useEffect(() => {
    if (mode) {
      localStorage.setItem('designerMode', JSON.stringify(mode));
      // trigger resize so rendered elements can respond accordingly
      window.dispatchEvent(new Event('resize'));
    }
  }, [mode]);

  // clear any id query parameter and set a name parameter if the design changes
  React.useEffect(() => {
    if (!load && changes.length > 1) {
      const params = getParams();
      if (!params.name || params.name !== design.name) {
        const search = `?name=${encodeURIComponent(design.name)}`;
        window.history.replaceState(
          undefined,
          undefined,
          window.location.pathname + search,
        );
      }
    }
  }, [changes, design, load]);

  const onKey = React.useCallback(
    event => {
      if (event.metaKey || event.ctrlKey) {
        if (event.key === 'e' || event.key === 'E' || event.key === '.') {
          event.preventDefault();
          setMode(mode === 'preview' ? 'edit' : 'preview');
        } else if (event.key === ';') {
          event.preventDefault();
          setMode(mode !== 'comments' ? 'comments' : 'preview');
        } else if (event.key === 'p' && event.shiftKey) {
          const stored = localStorage.getItem('identity');
          if (stored) {
            const identity = JSON.parse(stored);
            publish({
              design,
              ...identity,
              onChange: setDesign,
              onError: error => console.error(error),
            });
          } else {
            console.warn('You need to have published to be able to re-publish');
          }
        }
      }
    },
    [design, mode],
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

  let columns;
  if (responsive === 'small' || mode === 'preview') columns = 'flex';
  else if (mode === 'comments') {
    columns = [
      ['1/2', 'flex'],
      ['small', 'medium'],
    ];
  } else if (mode === 'edit') {
    columns = [
      ['small', 'medium'],
      ['1/2', 'flex'],
      ['small', 'medium'],
    ];
  }

  return (
    <Grommet
      full
      theme={designerTheme}
      themeMode={colorMode}
      dir={rtl ? 'rtl' : undefined}
    >
      <Keyboard target="document" onKeyDown={onKey}>
        <Grid fill columns={columns}>
          {responsive !== 'small' && mode === 'edit' && (
            <Tree
              design={design}
              imports={imports}
              rtl={rtl}
              selected={selected}
              theme={theme}
              colorMode={colorMode}
              setColorMode={setColorMode}
              setDesign={changeDesign}
              setMode={setMode}
              setRTL={setRTL}
              setSelected={setSelected}
              onRedo={changeIndex > 0 && onRedo}
              onUndo={changeIndex < changes.length - 1 && onUndo}
            />
          )}

          {auth ? (
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
          ) : (
            <ErrorCatcher>
              <Canvas
                design={design}
                imports={imports}
                selected={selected}
                mode={mode}
                setDesign={changeDesign}
                setSelected={setSelected}
                theme={theme}
              />
            </ErrorCatcher>
          )}

          {responsive !== 'small' &&
            mode !== 'preview' &&
            (mode === 'comments' ? (
              <Comments
                design={design}
                selected={selected}
                setMode={setMode}
                setSelected={setSelected}
              />
            ) : !selectedComponent ? (
              <ScreenDetails
                design={design}
                selected={selected}
                setDesign={changeDesign}
                setSelected={setSelected}
              />
            ) : (
              <Properties
                design={design}
                libraries={libraries}
                imports={imports}
                theme={theme}
                selected={selected}
                component={selectedComponent}
                setDesign={changeDesign}
                setSelected={setSelected}
              />
            ))}
        </Grid>
      </Keyboard>
    </Grommet>
  );
};

export default App;
