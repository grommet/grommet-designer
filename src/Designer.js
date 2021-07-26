import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Grid, Keyboard, ResponsiveContext } from 'grommet';
import DesignContext from './DesignContext';
import ErrorCatcher from './ErrorCatcher';
import Canvas from './Canvas';
import Loading from './Loading';
import ConfirmReplace from './ConfirmReplace';
import Properties from './Properties/Properties';
import Tree from './Tree/Tree';
import Comments from './Comments/Comments';
import { getInitialSelected, getScreenByPath, publish } from './design';
import ScreenDetails from './Properties/ScreenDetails';
import designerLibrary from './libraries/designer';
import grommetLibrary from './libraries/grommet';
import { loadImports, loadTheme } from './design/load';
import { parseUrlParams } from './utils';

const defaultImports = [
  { name: grommetLibrary.name, library: grommetLibrary },
  { name: designerLibrary.name, library: designerLibrary },
];

const Designer = ({ design, chooseDesign, updateDesign }) => {
  const responsive = useContext(ResponsiveContext);
  const [selected, setSelected] = useState({});
  const [imports, setImports] = useState(defaultImports);
  const libraries = useMemo(
    () => imports.filter((i) => i.library).map((i) => i.library),
    [imports],
  );
  const [theme, setTheme] = useState();
  const [mode, setMode] = useState();
  const [confirmReplace, setConfirmReplace] = useState();
  const [changes, setChanges] = useState([]);
  const [changeIndex, setChangeIndex] = useState();
  const selectedComponent = useMemo(
    () =>
      selected.component ? design.components[selected.component] : undefined,
    [design, selected.component],
  );

  // load state
  useEffect(() => {
    if (!mode) {
      const initializeSelected = () => {
        const {
          location: { pathname },
        } = document;
        const screen = getScreenByPath(design, pathname);
        if (screen)
          setSelected({ screen, component: design.screens[screen].root });
        else setSelected(getInitialSelected(design));
      };

      const params = parseUrlParams(window.location.search);
      if (params.mode) {
        setMode(params.mode);
        initializeSelected();
      } else if (!design.local) {
        setMode('preview');
        initializeSelected();
      } else {
        const stored = localStorage.getItem(`${design.name}--state`);
        if (stored) {
          const { mode: nextMode, selected: nextSelected } = JSON.parse(stored);
          setMode(nextMode);
          setSelected(nextSelected);
        } else {
          setMode('edit');
          initializeSelected();
        }
      }
    }
  }, [design, mode]);

  // load theme
  useEffect(() => loadTheme(design.theme, setTheme), [design.theme]);

  // align imports with design.imports
  useEffect(() => {
    // remove any imports we don't want anymore
    const nextImports = imports.filter(
      ({ url }) =>
        !url || design.imports.findIndex((i) => i.url === url) !== -1,
    );
    let changed = nextImports.length !== imports.length;
    // add any imports we don't have yet
    design.imports.forEach(({ url }) => {
      if (nextImports.findIndex((i) => i.url === url) === -1) {
        nextImports.push({ url });
        changed = true;
      }
    });
    if (changed) setImports(nextImports);
  }, [design.imports, imports]);

  // load any imports we don't have yet
  useEffect(() => {
    loadImports(imports, (f) => {
      const nextImports = f(imports);
      setImports(nextImports);
    });
  }, [imports]);

  // browser navigation

  // react when user uses browser back and forward buttons
  useEffect(() => {
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
  useEffect(() => {
    if (selected.screen) {
      const {
        location: { pathname },
      } = document;
      // track selected screen in browser location, so browser
      // backward/forward controls work
      const screen = design.screens[selected.screen];
      if (screen && screen.path !== pathname) {
        const url = screen.path + window.location.search;
        window.history.pushState(undefined, undefined, url);
      }
    }
  }, [design, selected.screen]);

  useEffect(() => {
    document.title = design.name;
  }, [design.name]);

  // store design
  useEffect(() => {
    if (design && design.local) {
      // do this stuff lazily, so we don't bog down the UI
      const timer = setTimeout(() => {
        const date = new Date();
        date.setMilliseconds(0);
        design.date = date.toISOString();
        localStorage.setItem(design.name, JSON.stringify(design));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [design]);

  // store state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mode && mode !== 'thumb' && selected.screen) {
        localStorage.setItem(
          `${design.name}--state`,
          JSON.stringify({ mode, selected }),
        );
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [design.name, mode, selected]);

  // add to changes, if needed
  useEffect(() => {
    // do this stuff lazily to ride out typing sprees
    const timer = setTimeout(() => {
      // If we already have this design object, we must be doing an undo or
      // redo, and therefore no need to add a change
      if (!changes.some((change) => change === design)) {
        let nextChanges;
        nextChanges = [...changes];
        nextChanges = nextChanges.slice(changeIndex, 10);
        nextChanges.unshift(design);
        setChanges(nextChanges);
        setChangeIndex(0);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [changes, changeIndex, design]);

  // if selected doesn't exist anymore, reset it
  useEffect(() => {
    if (selected.screen && !design.screens[selected.screen]) {
      setSelected(getInitialSelected(design));
    } else if (selected.component && !design.components[selected.component]) {
      setSelected({
        ...selected,
        component: design.screens[selected.screen].root,
      });
    }
  }, [design, selected]);

  const changeDesign = useCallback(
    (design) => {
      // We are trying to change a published design when we have a local
      // copy with the same name. Need the user to confirm.
      if (design && !design.local && localStorage.getItem(design.name)) {
        setConfirmReplace(design);
      } else {
        if (design) {
          design.local = true;
          // TODO: don't want to set modified when we are just publishing,
          // even though we've updated the email and pin
          if (design.publishedUrl) {
            // remember that we've changed this design since it was published
            design.modified = true;
          }
        }
        updateDesign(design);
      }
    },
    [updateDesign],
  );

  const onKey = useCallback(
    (event) => {
      if (event.metaKey || event.ctrlKey) {
        if (event.key === 'e' || event.key === 'E' || event.key === '.') {
          event.preventDefault();
          setMode(mode !== 'edit' ? 'edit' : 'preview');
        } else if (event.key === ';') {
          event.preventDefault();
          setMode(mode !== 'comments' ? 'comments' : 'preview');
        } else if (event.key === 'p' && event.shiftKey) {
          const stored = localStorage.getItem(`${design.name}--identity`);
          if (stored) {
            const identity = JSON.parse(stored);
            publish({
              design,
              ...identity,
              onChange: updateDesign,
              onError: (error) => console.error(error),
            });
          } else {
            console.warn('You need to have published to be able to re-publish');
          }
        }
      }
    },
    [design, mode, updateDesign],
  );

  const onUndo = useCallback(() => {
    const nextChangeIndex = Math.min(changeIndex + 1, changes.length - 1);
    const nextDesign = changes[nextChangeIndex];
    updateDesign(nextDesign);
    setChangeIndex(nextChangeIndex);
  }, [changes, changeIndex, updateDesign]);

  const onRedo = useCallback(() => {
    const nextChangeIndex = Math.max(changeIndex - 1, 0);
    const nextDesign = changes[nextChangeIndex];
    updateDesign(nextDesign);
    setChangeIndex(nextChangeIndex);
  }, [changes, changeIndex, updateDesign]);

  const designContext = useMemo(
    () => ({
      changeDesign,
      chooseDesign,
      component: selectedComponent,
      design,
      imports,
      libraries,
      mode,
      onRedo: changeIndex > 0 && onRedo,
      onUndo: changeIndex < changes.length - 1 && onUndo,
      selected,
      setMode,
      setSelected,
      theme,
      updateDesign,
    }),
    [
      changeDesign,
      changeIndex,
      changes,
      chooseDesign,
      design,
      imports,
      libraries,
      mode,
      onRedo,
      onUndo,
      selected,
      selectedComponent,
      setMode,
      setSelected,
      theme,
      updateDesign,
    ],
  );

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

  if (!theme) return <Loading />;

  return (
    <DesignContext.Provider value={designContext}>
      <Keyboard target="document" onKeyDown={onKey}>
        <Grid fill columns={columns} rows="full">
          {responsive !== 'small' && mode === 'edit' && <Tree />}

          <ErrorCatcher>
            <Canvas />
          </ErrorCatcher>

          {responsive !== 'small' &&
            mode !== 'preview' &&
            (mode === 'comments' ? (
              <Comments />
            ) : selectedComponent ? (
              <Properties />
            ) : selected.screen ? (
              <ScreenDetails />
            ) : null)}
          {confirmReplace && (
            <ConfirmReplace
              design={design}
              nextDesign={confirmReplace}
              onDone={(nextDesign) => {
                if (nextDesign) updateDesign(nextDesign);
                setConfirmReplace(undefined);
              }}
            />
          )}
        </Grid>
      </Keyboard>
    </DesignContext.Provider>
  );
};

export default Designer;
