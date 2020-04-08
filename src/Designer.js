import React from 'react';
import {
  Box,
  Button,
  Grid,
  Keyboard,
  Layer,
  Paragraph,
  ResponsiveContext,
  Text,
} from 'grommet';
import ErrorCatcher from './ErrorCatcher';
import Canvas from './Canvas';
import Properties from './Properties/Properties';
import Tree from './Tree/Tree';
import Comments from './Comments/Comments';
import { getInitialSelected, getScreenByPath, publish } from './design';
import ScreenDetails from './Properties/ScreenDetails';
import designerLibrary from './libraries/designer';
import grommetLibrary from './libraries/grommet';
import { loadImports, loadTheme } from './design/load';
import { getParams } from './utils';

const defaultImports = [
  { name: grommetLibrary.name, library: grommetLibrary },
  { name: designerLibrary.name, library: designerLibrary },
];

const Designer = ({ colorMode, design, setDesign }) => {
  const responsive = React.useContext(ResponsiveContext);
  const [selected, setSelected] = React.useState({});
  const [imports, setImports] = React.useState(defaultImports);
  const libraries = React.useMemo(
    () => imports.filter(i => i.library).map(i => i.library),
    [imports],
  );
  const [theme, setTheme] = React.useState();
  const [mode, setMode] = React.useState();
  const [confirmReplace, setConfirmReplace] = React.useState();
  const [changes, setChanges] = React.useState([]);
  const [changeIndex, setChangeIndex] = React.useState();
  const selectedComponent = React.useMemo(
    () =>
      selected.component ? design.components[selected.component] : undefined,
    [design, selected.component],
  );

  // load state
  React.useEffect(() => {
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

      const params = getParams();
      if (params.mode) {
        setMode(params.mode);
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
  React.useEffect(() => loadTheme(design.theme, setTheme), [design.theme]);

  // align imports with design.imports
  React.useEffect(() => {
    // remove any imports we don't want anymore
    const nextImports = imports.filter(
      ({ url }) => !url || design.imports.findIndex(i => i.url === url) !== -1,
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
  }, [design.imports, imports]);

  // load any imports we don't have yet
  React.useEffect(() => {
    loadImports(imports, f => {
      const nextImports = f(imports);
      setImports(nextImports);
    });
  }, [imports]);

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

  // store design
  React.useEffect(() => {
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
  React.useEffect(() => {
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
  React.useEffect(() => {
    // do this stuff lazily to ride out typing sprees
    const timer = setTimeout(() => {
      // If we already have this design object, we must be doing an undo or
      // redo, and therefore no need to add a change
      if (!changes.some(change => change === design)) {
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

  const changeDesign = design => {
    if (design && !design.local && localStorage.getItem(design.name)) {
      setConfirmReplace(design);
    } else {
      if (design) design.local = true;
      setDesign(design);
    }
  };

  const onKey = React.useCallback(
    event => {
      if (event.metaKey || event.ctrlKey) {
        if (event.key === 'e' || event.key === 'E' || event.key === '.') {
          event.preventDefault();
          setMode(mode !== 'edit' ? 'edit' : 'preview');
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
    [design, mode, setDesign],
  );

  const onUndo = React.useCallback(() => {
    const nextChangeIndex = Math.min(changeIndex + 1, changes.length - 1);
    const nextDesign = changes[nextChangeIndex];
    setDesign(nextDesign);
    setChangeIndex(nextChangeIndex);
  }, [changes, changeIndex, setDesign]);

  const onRedo = React.useCallback(() => {
    const nextChangeIndex = Math.max(changeIndex - 1, 0);
    const nextDesign = changes[nextChangeIndex];
    setDesign(nextDesign);
    setChangeIndex(nextChangeIndex);
  }, [changes, changeIndex, setDesign]);

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
    <Keyboard target="document" onKeyDown={onKey}>
      <Grid fill columns={columns}>
        {responsive !== 'small' && mode === 'edit' && (
          <Tree
            design={design}
            imports={imports}
            selected={selected}
            theme={theme}
            colorMode={colorMode}
            setDesign={changeDesign}
            setMode={setMode}
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
            mode={mode}
            setDesign={changeDesign}
            setSelected={setSelected}
            theme={theme}
          />
        </ErrorCatcher>

        {responsive !== 'small' &&
          mode !== 'preview' &&
          (mode === 'comments' ? (
            <Comments
              design={design}
              selected={selected}
              setMode={setMode}
              setSelected={setSelected}
            />
          ) : selectedComponent ? (
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
          ) : selected.screen ? (
            <ScreenDetails
              design={design}
              selected={selected}
              setDesign={changeDesign}
              setSelected={setSelected}
            />
          ) : null)}
        {confirmReplace && (
          <Layer
            position="top"
            margin="medium"
            modal
            onEsc={() => setConfirmReplace(false)}
            onClickOutside={() => setConfirmReplace(false)}
          >
            <Box pad="large">
              <Paragraph>
                You already have a design named{' '}
                <Text weight="bold">{design.name}</Text>. If you make a change,
                you will replace your local copy. If you do not want to replace
                your copy, you should rename this design.
              </Paragraph>
              <Box direction="row" align="center" gap="medium">
                <Button
                  label={`Replace my ${design.name}`}
                  onClick={() => {
                    confirmReplace.derivedFromId = design.id;
                    confirmReplace.local = true;
                    setDesign(confirmReplace);
                    setConfirmReplace(undefined);
                  }}
                />
                <Button
                  label="Discard change"
                  onClick={() => setConfirmReplace(undefined)}
                />
              </Box>
            </Box>
          </Layer>
        )}
      </Grid>
    </Keyboard>
  );
};

export default Designer;
