export const parseUrlParams = (url) => {
  const params = {};
  (url.split('?')[1] || '').split('&').forEach((p) => {
    const [k, v] = p.split('=');
    params[k] = decodeURIComponent(v);
  });
  return params;
};

export const pushUrl = (url) => {
  window.history.pushState(undefined, undefined, url);
};

export const pushPath = (path) => {
  pushUrl(path + window.location.search);
};
