import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import PropTypes from 'prop-types';
import { Watcher } from './Router';

const CONFIG = {
  trackerId: 'UA-148924637-1',
  debug: false,
};

const Analytics = ({ children, path }) => {
  useEffect(() => {
    const { trackerId, ...config } = CONFIG;
    ReactGA.initialize(trackerId, { ...config });
  }, []);

  useEffect(() => {
    ReactGA.set({ page: path });
    ReactGA.pageview(path);
  }, [path]);

  return children;
};

Analytics.propTypes = {
  children: PropTypes.node.isRequired,
  path: PropTypes.string,
};

Analytics.defaultProps = {
  path: undefined,
};

export default props => (
  <Watcher>{path => <Analytics path={path} {...props} />}</Watcher>
);
