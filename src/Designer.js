import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import ReactGA from 'react-ga';
import { Box, Grid, Keyboard, ResponsiveContext } from 'grommet';
import SelectionContext from './SelectionContext';
import ErrorCatcher from './ErrorCatcher';
import Canvas from './Canvas2';
import Loading from './Loading';
// import ConfirmReplace from './ConfirmReplace';
import Properties from './Properties/Properties';
import Tree from './Tree/Tree';
// import Comments from './Comments/Comments';
// import { getInitialSelected, getScreenByPath, publish } from './design';
import { load as loadDesign, getRoot, getScreen, useDesign } from './design2';
import ScreenDetails from './Properties/ScreenDetails';
import { /* getComponentType, */ parseUrlParams } from './utils';

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
  const responsive = useContext(ResponsiveContext);
  const [name, setName] = useState();
  const [ready, setReady] = useState(false);
  const [root, setRoot] = useState();
  const [selection, setSelection] = useState();
  const [mode, setMode] = useState(thumb ? 'thumb' : undefined);
  // const [confirmReplace, setConfirmReplace] = useState();
  // load state
  useEffect(() => {
    // if (!mode) {
    // const initializeSelected = () => {
    //   const {
    //     location: { pathname },
    //   } = document;
    //   const screen = getScreenByPath(design, pathname);
    //   if (screen)
    //     setSelected({ screen, component: design.screens[screen].root });
    //   else setSelected(getInitialSelected(design));
    // };
    // if (params.mode) {
    //   setMode(params.mode);
    //   initializeSelected();
    // } else if (!design.local) {
    //   setMode('preview');
    //   initializeSelected();
    // } else {
    //   const stored = localStorage.getItem(`${design.name}--state`);
    //   if (stored) {
    //     const { mode: nextMode, selected: nextSelected } = JSON.parse(stored);
    //     setMode(nextMode);
    //     setSelected(nextSelected);
    //   } else {
    //     setMode('edit');
    //     initializeSelected();
    //   }
    // }
    // }
  }, []);

  // when the document name changes, update title and URL
  const design = useDesign();
  if (design && design.name !== name) setName(design.name);

  useEffect(() => {
    if (name) {
      document.title = name;
      const url = `${window.location.pathname}?name=${encodeURIComponent(
        name,
      )}`;
      window.history.replaceState(undefined, undefined, url);
    }
  }, [name]);

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

  // // load data, if needed
  // useEffect(() => {
  //   if (design.data) {
  //     Object.keys(design.data).forEach((key) => {
  //       if (design.data[key].slice(0, 4) === 'http') {
  //         fetch(design.data[key])
  //           .then((response) => response.json())
  //           .then((response) => {
  //             setData((prevData) => {
  //               const nextData = JSON.parse(JSON.stringify(prevData || {}));
  //               nextData[key] = response;
  //               return nextData;
  //             });
  //           });
  //       } else if (design.data[key]) {
  //         setData((prevData) => {
  //           const nextData = JSON.parse(JSON.stringify(prevData || {}));
  //           try {
  //             nextData[key] = JSON.parse(design.data[key]);
  //           } catch (e) {
  //             console.warn(e.message);
  //           }
  //           return nextData;
  //         });
  //       }
  //     });
  //   }
  // }, [design.data]);

  useEffect(() => {
    loadDesign(loadProps)
      .then((design) => {
        if (!thumb) {
          // load any saved state for this design
          const params = parseUrlParams(window.location.search);
          const stored = localStorage.getItem(`${design.name}--state`);
          if (stored) {
            const { mode: nextMode, selection: nextSelection } =
              JSON.parse(stored);
            setMode(params.mode || nextMode);
            setSelection(nextSelection);
          } else {
            setMode(params.mode || 'edit');
          }
        }
      })
      .then(() => {
        // TODO: decide where to start, tie to routing
        const nextRoot = getRoot();
        setRoot(nextRoot);
      })
      .then(() => {
        ReactGA.event({ category: 'switch', action: 'published design' });
      })
      .then(() => setReady(true))
      .catch(() => {
        // TODO: handle error, especially 401 prompt for password
      });
    return () => setReady(false);
  }, [loadProps, thumb]);

  // browser navigation

  // // react when user uses browser back and forward buttons
  // useEffect(() => {
  //   const onPopState = () => {
  //     const {
  //       location: { pathname },
  //     } = document;
  //     const screen = getScreenByPath(design, pathname);
  //     if (screen)
  //       setSelected({ screen, component: design.screens[screen].root });
  //   };

  //   window.addEventListener('popstate', onPopState);
  //   return () => window.removeEventListener('popstate', onPopState);
  // }, [design]);

  // // push state when the user navigates
  // useEffect(() => {
  //   if (selected.screen) {
  //     const {
  //       location: { pathname },
  //     } = document;
  //     // track selected screen in browser location, so browser
  //     // backward/forward controls work
  //     const screen = design.screens[selected.screen];
  //     if (screen && screen.path !== pathname) {
  //       const url = screen.path + window.location.search;
  //       window.history.pushState(undefined, undefined, url);
  //     }
  //   }
  // }, [design, selected.screen]);

  // store state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!thumb && mode && selection) {
        localStorage.setItem(
          `${name}--state`,
          JSON.stringify({ mode, selection }),
        );
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [name, mode, selection, thumb]);

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
          // } else if (event.key === 'p' && event.shiftKey) {
          //   const stored = localStorage.getItem(`${design.name}--identity`);
          //   if (stored) {
          //     const identity = JSON.parse(stored);
          //     publish({
          //       design,
          //       ...identity,
          //       onChange: updateDesign,
          //       onError: (error) => console.error(error),
          //     });
          //   } else {
          //     console.warn('You need to have published to be able to re-publish');
          //   }
        }
      }
    },
    [mode],
  );

  // const listeners = useRef({});

  const selectionContext = useMemo(
    () => [selection, setSelection],
    [selection],
  );

  if (!ready) return <Loading />;

  const Details =
    selection && ((getScreen(selection) && ScreenDetails) || Properties);

  let content = (
    <ErrorCatcher>
      <Canvas root={root} />
    </ErrorCatcher>
  );

  if (!thumb && responsive !== 'small') {
    if (mode === 'edit') {
      content = (
        <SelectionContext.Provider value={selectionContext}>
          <Grid columns={editGridColumns}>
            <Tree
              setMode={setMode}
              onClose={() => {
                window.history.pushState(undefined, undefined, '/');
                onClose();
              }}
            />
            <Box height="100vh" overflow="auto">
              {content}
            </Box>
            {Details && <Details />}
          </Grid>
        </SelectionContext.Provider>
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
      {content}
    </Keyboard>
  );
};

export default Designer;
