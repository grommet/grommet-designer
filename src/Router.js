// NOTE: our routing needs are so simple, we roll our own
// to avoid dependencies on react-router, to stay leaner.

import React, { Children, useEffect } from 'react';

const RouterContext = React.createContext({});

export const Router = ({ children }) => {
  const [path, setPath] = React.useState();

  useEffect(() => {
    const onPopState = () => setPath(document.location.pathname);
    window.addEventListener('popstate', onPopState);
    onPopState();
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const push = nextPath => {
    if (nextPath !== path) {
      window.history.pushState(undefined, undefined, nextPath);
      setPath(nextPath);
      window.scrollTo(0, 0);
    }
  };

  return (
    <RouterContext.Provider value={{ path, push }}>
      {children}
    </RouterContext.Provider>
  );
};

export const Routes = ({ children }) => {
  const { path: contextPath } = React.useContext(RouterContext);
  let found;
  Children.forEach(children, child => {
    if (!found && contextPath === child.props.path) found = child;
  });
  return found;
};

export const Route = ({ Component, path }) => {
  const { path: contextPath } = React.useContext(RouterContext);
  return contextPath === path ? <Component /> : null;
};

export const Watcher = ({ children }) => (
  <RouterContext.Consumer>
    {({ path }) => children(path)}
  </RouterContext.Consumer>
);

export default Router;
