import React from 'react';
import ReactGA from 'react-ga';
import { Grommet, Grid, Keyboard, ResponsiveContext, grommet } from 'grommet';
import ErrorCatcher from './ErrorCatcher';
import Canvas from './Canvas';
import Properties from './Properties/Properties';
import Tree from './Tree/Tree';
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
  const [preview, setPreview] = React.useState(true);
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
    loadDesign(
      pathname === '/_new' ? '_new' : params.id,
      nextDesign => {
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
              pathname && pathname !== '/_new'
                ? getScreenByPath(nextDesign, pathname)
                : nextDesign.screenOrder[0];
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
      },
      true,
    );
  }, []);

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
      const params = getParams();
      setImports(load.imports);
      setTheme(load.theme);
      setDesign(load.design);
      setSelected(load.selected);
      setPreview(params.preview ? JSON.parse(params.preview) : !!params.id);
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
    if (!load) {
      const {
        location: { pathname },
      } = document;
      // track selected screen in browser location, so browser
      // backward/forward controls work
      const screen = design.screens[selected.screen];
      if (screen && screen.path !== pathname) {
        window.history.pushState(undefined, undefined, screen.path);
      }
    }
  }, [design, load, selected.screen]);

  // store design
  React.useEffect(() => {
    if (!load) {
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

  // persist preview state when it changes
  React.useEffect(() => {
    localStorage.setItem('preview', JSON.stringify(preview));
    // trigger resize so rendered elements can respond accordingly
    window.dispatchEvent(new Event('resize'));
  }, [preview]);

  // set body editing class when preview changes, so we can use some
  // custom CSS for Layer. Yes, this is a bit of a hack :(
  React.useEffect(() => {
    if (preview) {
      document.body.classList.remove('editing');
    } else {
      document.body.classList.add('editing');
    }
  }, [preview]);

  const onKey = React.useCallback(
    event => {
      if (event.metaKey || event.ctrlKey) {
        if (event.key === 'e' || event.key === 'E') {
          event.preventDefault();
          setPreview(!preview);
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
    [design, preview],
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
                  ['small', 'medium'],
                  ['1/2', 'flex'],
                  ['small', 'medium'],
                ]
          }
        >
          {responsive !== 'small' && !preview && (
            <Tree
              design={design}
              imports={imports}
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
              design={design}
              imports={imports}
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
