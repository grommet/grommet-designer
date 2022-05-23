import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
// import ReactGA from 'react-ga';
import { Box, Grid, Keyboard, ResponsiveContext } from 'grommet';
import AppContext from './AppContext';
import SelectionContext from './SelectionContext';
import ErrorCatcher from './ErrorCatcher';
import NewScreen from './NewScreen';
import Canvas from './Canvas2';
import Data from './Data';
import Loading from './Loading';
// import ConfirmReplace from './ConfirmReplace';
import Properties from './Properties/Properties';
import Tree from './Tree/Tree';
// import Comments from './Comments/Comments';
import {
  load as loadDesign,
  getComponent,
  getDesign,
  getLocationForPath,
  getPathForLocation,
  getScreen,
  getType,
  isValidId,
  setDesignProperty,
  setProperty,
  useDesignSummary,
  useScreen,
} from './design2';
import ScreenDetails from './Properties/ScreenDetails';
import { parseUrlParams, pushPath, pushUrl } from './utils';

const editGridColumns = [
  ['small', 'medium'],
  ['1/2', 'flex'],
  ['small', 'medium'],
];

const commentGridColumns = [
  ['1/2', 'flex'],
  ['small', 'medium'],
];

const Designer = ({ loadProps, onClose, thumb }) => {
  const { grommetThemeMode, setThemeMode } = useContext(AppContext);
  const responsive = useContext(ResponsiveContext);
  // const [name, setName] = useState();
  const [ready, setReady] = useState(false);
  const [location, setLocation] = useState();
  const [selection, setSelection] = useState();
  const [mode, setMode] = useState(thumb ? 'thumb' : undefined);
  // const [confirmReplace, setConfirmReplace] = useState();

  // when the document name changes, update title and URL
  const summary = useDesignSummary();
  // if (nextName !== name) setName(nextName);

  useEffect(() => {
    if (summary.local && summary.name) {
      document.title = summary.name;
      const url = `${window.location.pathname}?name=${encodeURIComponent(
        summary.name,
      )}`;
      window.history.replaceState(undefined, undefined, url);
    }
  }, [summary]);

  // // align imports with design.imports
  // useEffect(() => {
  //   // remove any imports we don't want anymore
  //   const nextImports = imports.filter(
  //     ({ url }) =>
  //       !url || design.imports.findIndex((i) => i.url === url) !== -1,
  //   );
  //   let changed = nextImports.length !== imports.length;
  //   // add any imports we don't have yet
  //   design.imports.forEach(({ url }) => {
  //     if (nextImports.findIndex((i) => i.url === url) === -1) {
  //       nextImports.push({ url });
  //       changed = true;
  //     }
  //   });
  //   if (changed) setImports(nextImports);
  // }, [design.imports, imports]);

  // // load any imports we don't have yet
  // useEffect(() => {
  //   loadImports(imports, (f) => {
  //     const nextImports = f(imports);
  //     setImports(nextImports);
  //   });
  // }, [imports]);

  // load design when we start

  useEffect(() => {
    loadDesign(loadProps)
      .then((design) => {
        if (!thumb) {
          // load any saved state for this design
          const params = parseUrlParams(window.location.search);
          const stored = localStorage.getItem(`${design.name}--state`);
          if (stored) {
            const savedState = JSON.parse(stored);
            setMode(params.mode || savedState.mode);
            if (isValidId(savedState.selection))
              setSelection(savedState.selection);
            setLocation(savedState.location);
          } else {
            setMode(params.mode || 'edit');
            if (loadProps.location)
              setLocation(getLocationForPath(loadProps.location));
            if (loadProps.selection) setSelection(loadProps.selection);
          }
        }
        return design;
      })
      // .then(() => {
      //   setLocation(getLocationForPath(window.location.pathname));
      // })
      // .then(() => {
      //   ReactGA.event({ category: 'switch', action: 'published design' });
      // })
      .then(() => setReady(true))
      .catch((e) => {
        console.error(e);
        // TODO: handle error, especially 401 prompt for password
      });
    return () => setReady(false);
  }, [loadProps, thumb]);

  // browser navigation

  // following a link changes component hide or screen path
  const followLink = useCallback(
    (link) => {
      if (Array.isArray(link)) link.forEach(followLink);
      else if (link.control === 'toggleThemeMode') {
        setThemeMode(grommetThemeMode === 'dark' ? 'light' : 'dark');
      } else if (link.component) {
        const component = getComponent(link.component);
        setProperty(link.component, undefined, 'hide', !component.hide);
        if (!component.hide) setSelection(undefined);
      } else if (link.screen) {
        setLocation({ screen: link.screen });
        setSelection(link.screen);
      }
    },
    [grommetThemeMode, setThemeMode],
  );

  const followLinkOption = useCallback((link, value) => {
    // figure out which link to use, if any
    Object.keys(link)
      .filter((n) => link[n])
      .forEach((name) => {
        // function shared by array and non-array cases
        const follow = (link) => {
          // TODO: refactor, maybe re-use followLink() above?
          if (link.control) {
            const design = getDesign();
            setDesignProperty(
              'themeMode',
              design.themeMode === 'dark' ? 'light' : 'dark',
            );
          } else if (link.component) {
            const component = getComponent(link.component);
            const type = getType(component.type);
            const { hideable, selectable } = type;
            if (selectable) {
              // -link-checked- cases
              let active;
              if (name === '-unchecked-' && !value) active = 1;
              else if (name === '-checked-' && value) active = 2;
              else if (name === '-both-') active = component.props.active + 1;
              if (component.props.active > component.children.length)
                active = 1;
              setProperty(link.component, 'props', 'active', active);
            } else if (hideable) {
              // -link-checked- cases
              let hide;
              if (name === '-checked-') hide = !value;
              else if (name === '-unchecked-') hide = value;
              // undefined ok
              else if (name === '-both-') hide = !value;
              // -link-option- cases
              else if (name === '-any-') hide = !value || !value.length;
              else if (name === '-none-')
                hide = Array.isArray(value)
                  ? !!value.length && value[0] !== name
                  : !!value && value !== name;
              else
                hide = Array.isArray(value)
                  ? !value.includes(name)
                  : value !== name;
              if (hide !== undefined && component.hide !== hide)
                setProperty(link.component, undefined, 'hide', hide);
            }
          }
        };

        if (Array.isArray(link[name])) link[name].forEach(follow);
        else follow(link[name]);
      });
  }, []);

  // when user uses browser back and forward buttons,
  // clear selection and set path
  useEffect(() => {
    const onPopState = () => {
      setLocation(getLocationForPath(window.location.pathname));
      setSelection(undefined);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (location) {
      let nextPath = getPathForLocation(location);
      if (nextPath !== window.location.pathname) {
        // track location in browser location, so browser
        // backward/forward controls work
        pushPath(nextPath);
      }
    }
  }, [location]);

  // store mode and selection state if they change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!thumb && mode && selection) {
        localStorage.setItem(
          `${summary.name}--state`,
          JSON.stringify({ location, mode, selection }),
        );
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [location, mode, selection, summary.name, thumb]);

  // // if selected doesn't exist anymore, reset it
  // useEffect(() => {
  //   if (selected.screen && !design.screens[selected.screen]) {
  //     setSelected(getInitialSelected(design));
  //   } else if (selected.component && !design.components[selected.component]) {
  //     setSelected({
  //       ...selected,
  //       component: design.screens[selected.screen].root,
  //     });
  //   }
  // }, [design, selected]);

  // const changeDesign = useCallback(
  //   (design) => {
  //     // We are trying to change a published design when we have a local
  //     // copy with the same name. Need the user to confirm.
  //     if (design && !design.local && localStorage.getItem(design.name)) {
  //       setConfirmReplace(design);
  //     } else {
  //       if (design) {
  //         design.local = true;
  //         // TODO: don't want to set modified when we are just publishing,
  //         // even though we've updated the email and pin
  //         if (design.publishedUrl) {
  //           // remember that we've changed this design since it was published
  //           design.modified = true;
  //         }
  //       }
  //       updateDesign(design);
  //     }
  //   },
  //   [updateDesign],
  // );

  const onKey = useCallback(
    (event) => {
      if (event.metaKey || event.ctrlKey) {
        if (event.key === 'e' || event.key === 'E' || event.key === '.') {
          event.preventDefault();
          setMode(mode !== 'edit' ? 'edit' : 'preview');
        } else if (event.key === ';') {
          event.preventDefault();
          setMode(mode !== 'comments' ? 'comments' : 'preview');
        }
      }
    },
    [mode],
  );

  // we do this so we can detect when the root of the screen changes
  const screen = useScreen(location?.screen);

  const [treeRoot, canvasRoot] = useMemo(() => {
    if (!location) return [];
    if (location.screen && screen) return [undefined, screen.root];
    if (location.property) {
      const { id, value, ...rest } = location.property;
      return [{ id, value, ...rest }, value];
    }
    return [];
  }, [location, screen]);

  const selectionContext = useMemo(
    () =>
      mode === 'edit'
        ? [
            selection,
            setSelection,
            { followLink, followLinkOption, setLocation },
          ]
        : [undefined, undefined, { followLink, followLinkOption }],
    [followLink, followLinkOption, mode, selection],
  );

  if (!ready) return <Loading />;

  // console.log('!!! Designer', { location, selection, treeRoot, canvasRoot });

  const Details =
    selection && ((getScreen(selection) && ScreenDetails) || Properties);

  let content;
  if (canvasRoot || treeRoot)
    content = (
      <ErrorCatcher>
        <Canvas root={treeRoot?.value || canvasRoot} />
      </ErrorCatcher>
    );
  else if (getScreen(selection)) content = <NewScreen />;
  else if (selection) content = <Data id={selection} />;

  if (!thumb && responsive !== 'small') {
    if (mode === 'edit') {
      content = (
        <Grid columns={editGridColumns}>
          <Tree
            root={treeRoot}
            setMode={setMode}
            onClose={() => {
              pushUrl('/');
              onClose();
            }}
          />
          <Box height="100vh" overflow="auto">
            {content}
          </Box>
          {Details && <Details />}
        </Grid>
      );
    } else if (mode === 'comments') {
      content = (
        <Grid columns={commentGridColumns}>
          <Box height="100vh" overflow="auto">
            {content}
          </Box>
          {/* <Comments /> */}
        </Grid>
      );
    }
  }

  // if (/* confirmReplace || */ (responsive !== 'small' && mode !== 'preview')) {
  //   content = (
  //     <Grid columns={columns}>
  //       {mode === 'edit' && <Tree />}

  //       <Box height="100vh" overflow="auto">
  //         {content}
  //       </Box>

  //       {responsive !== 'small' && mode !== 'preview' && (
  //         <Box height="100vh">
  //           {(mode === 'comments' && <Comments />) ||
  //             (selectedComponent && <Properties />) ||
  //             (selected.screen && <ScreenDetails />)}
  //         </Box>
  //       )}
  //       {/* {confirmReplace && (
  //         <ConfirmReplace
  //           design={design}
  //           nextDesign={confirmReplace}
  //           onDone={(nextDesign) => {
  //             if (nextDesign) updateDesign(nextDesign);
  //             setConfirmReplace(undefined);
  //           }}
  //         />
  //       )} */}
  //     </Grid>
  //   );
  // }

  return (
    <Keyboard target="document" onKeyDown={onKey}>
      <SelectionContext.Provider value={selectionContext}>
        {content}
      </SelectionContext.Provider>
    </Keyboard>
  );
};

export default Designer;
