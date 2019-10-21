import React from 'react';
import { Grommet, Grid, Keyboard, ResponsiveContext, grommet } from 'grommet';
import Canvas from './Canvas';
import Properties from './Properties';
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
import ScreenDetails from './ScreenDetails';
import themes from './themes';
import designerLibrary from './libraries/designer';
import grommetLibrary from './libraries/grommet';

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
  const [theme, setTheme] = React.useState(grommet);
  const [colorMode, setColorMode] = React.useState('dark');
  const [preview, setPreview] = React.useState(true);
  const [changes, setChanges] = React.useState([]);
  const [changeIndex, setChangeIndex] = React.useState();
  const [designs, setDesigns] = React.useState([]);
  const [libraries /* setLibraries */] = React.useState([
    grommetLibrary,
    designerLibrary,
  ]);
  const selectedComponent = React.useMemo(
    () =>
      design.components[selected.component] ||
      design.screens[selected.screen || design.screenOrder[0]].root,
    [design, selected],
  );

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
          const screen = pathname
            ? getScreenByPath(nextDesign, pathname)
            : nextDesign.screenOrder[0];
          const component = nextDesign.screens[screen].root;
          const nextSelected = { screen, component };
          setDesign(nextDesign);
          setSelected(nextSelected);
          setChanges([{ design: nextDesign, selected: nextSelected }]);
          setChangeIndex(0);
        });
    } else {
      let nextDesign;
      let nextSelected;
      if (pathname === '/_new') {
        nextDesign = setupDesign(bare);
      } else {
        let stored = localStorage.getItem('activeDesign');
        if (stored) {
          stored = localStorage.getItem(stored);
        }
        if (stored) {
          nextDesign = JSON.parse(stored);
          stored = localStorage.getItem('selected');
          if (stored) nextSelected = JSON.parse(stored);
        } else {
          nextDesign = setupDesign(bare);
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

    // if (design.library) {
    //   // load design library

    //   const t = document.createElement('script');
    //   // t.setAttribute('src', design.library);
    //   t.setAttribute('type', 'module');
    //   const s = document.getElementsByTagName('script')[0];
    //   t.appendChild(document.createTextNode(`
    //     import lib from '${design.library}';
    //     window.lib = lib;
    //   `));
    //   s ? s.parentNode.insertBefore(t, s) : document.head.appendChild(t);
    //   setTimeout(() => {
    //     console.log('!!!', window.lib);
    //     if (window.lib) {
    //       this.setState({ libraries: [window.lib, ...this.state.libraries]});
    //     }
    //   }, 1000);
    // }
  }, []);

  React.useEffect(() => {
    const stored = localStorage.getItem('designs');
    if (stored) setDesigns(JSON.parse(stored));
  }, []);

  React.useEffect(() => {
    const stored = localStorage.getItem('colorMode');
    if (stored) setColorMode(stored);
  }, []);

  // browser navigation
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

  React.useEffect(() => {
    const {
      location: { pathname },
    } = document;
    // track selected screen in browser location, so browser
    // backward/forward controls work
    const screen = design.screens[selected.screen];
    if (screen.path !== pathname) {
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

  // setup theme
  React.useEffect(() => {
    const nextTheme = design.theme;
    if (typeof nextTheme === 'string') {
      if (nextTheme.slice(0, 6) === 'https:') {
        // extract id from URL
        const id = nextTheme.split('id=')[1];
        fetch(`${themeApiUrl}/${id}`)
          .then(response => response.json())
          .then(setTheme);
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

  const onKey = event => {
    if (event.metaKey) {
      if (event.key === 'e' || event.key === 'E') {
        event.preventDefault();
        setPreview(!preview);
      }
    }
  };

  const onUndo = () => {
    const nextChangeIndex = Math.min(changeIndex + 1, changes.length - 1);
    const { design: nextDesign, selected: nextSelected } = changes[
      nextChangeIndex
    ];
    setDesign(nextDesign);
    setSelected(nextSelected);
    setChangeIndex(nextChangeIndex);
  };

  const onRedo = () => {
    const nextChangeIndex = Math.max(changeIndex - 1, 0);
    const { design: nextDesign, selected: nextSelected } = changes[
      nextChangeIndex
    ];
    setDesign(nextDesign);
    setSelected(nextSelected);
    setChangeIndex(nextChangeIndex);
  };

  return (
    <Grommet full theme={grommet}>
      <Keyboard target="document" onKeyDown={onKey}>
        <Grid
          fill
          columns={
            responsive === 'small' || preview
              ? 'flex'
              : [['small', '288px'], ['1/2', 'flex'], ['small', 'medium']]
          }
        >
          {responsive !== 'small' && !preview && (
            <Tree
              design={design}
              libraries={libraries}
              selected={selected}
              theme={theme}
              colorMode={colorMode}
              setDesign={setDesign}
              setSelected={setSelected}
              onRedo={changeIndex > 0 && onRedo}
              onUndo={changeIndex < changes.length - 1 && onUndo}
            />
          )}

          <Canvas
            design={design}
            libraries={libraries}
            selected={selected}
            preview={preview}
            setDesign={setDesign}
            setSelected={setSelected}
            theme={theme}
          />

          {responsive !== 'small' &&
            !preview &&
            (selectedComponent.type === 'Grommet' ? (
              <ScreenDetails
                design={design}
                selected={selected}
                colorMode={colorMode}
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
                colorMode={colorMode}
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
