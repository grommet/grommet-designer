import { grommet } from 'grommet';
import ReactGA from 'react-ga';
import { themeForUrl, themeForValue } from '../themes';
import { setupDesign } from './reset';
import { upgradeDesign } from './upgrade';
import { bare } from './bare';
import { apiUrl, themeApiUrl } from './urls';

export const loadDesign = ({
  fresh,
  id,
  initial,
  json,
  name,
  password,
  onLoad,
  onAuth,
  onError,
}) => {
  if (fresh) {
    const design = setupDesign(bare);
    upgradeDesign(design);
    design.local = true;
    design.name = 'new design';
    onLoad(design);
    ReactGA.event({ category: 'switch', action: 'force new design' });
  } else if (id) {
    const options = {};
    if (password) {
      options.headers = {
        Authorization: `Basic ${btoa(password)}`,
      };
    }
    fetch(`${apiUrl}/${id}`, options).then(response => {
      if (response.status === 401) onAuth();
      else if (response.ok) {
        response.json().then(design => {
          upgradeDesign(design);
          // remember in case we make a change so we can set derivedFromId
          design.id = id;
          design.fetched = true;
          onLoad(design);
          if (initial)
            ReactGA.event({ category: 'switch', action: 'published design' });
        });
      } else {
        onError(`Unable to fetch design with id "${id}".`);
      }
    });
  } else if (name || json) {
    let design;
    if (name) {
      const stored = localStorage.getItem(name);
      if (!stored) {
        onError(
          `You don't appear to have a design called "${name}". Perhaps
          someone shared their local design URL and not a published
          one?`,
        );
        return;
      }
      design = JSON.parse(stored);
    } else {
      design = json;
    }
    upgradeDesign(design);
    design.local = true;
    if (design.id && design.publishedUrl) {
      // check if this design has been subsequently published
      fetch(`${apiUrl}/${design.id}`).then(response => {
        if (response.ok) {
          response.json().then(publishedDesign => {
            upgradeDesign(publishedDesign);
            if (publishedDesign.date > design.date) {
              design.subsequentPublish = publishedDesign;
            } else {
              delete design.subsequentPublish;
            }
            onLoad(design);
          });
        } else {
          onLoad(design);
        }
      });
    } else {
      onLoad(design);
    }
    ReactGA.event({
      category: 'switch',
      action: name ? 'previous design' : 'import design',
    });
  }
};

const npmTheme = {};

const loadThemePackage = ({ url, name, packageName, setTheme }) => {
  const nameParts = packageName.split('-'); // [grommet, theme, hpe]
  const varName = nameParts
    .map(p => `${p[0].toUpperCase()}${p.slice(1)}`)
    .join(''); // GrommetThemeHpe
  if (!document.getElementById(packageName)) {
    // we haven't loaded this theme, add it in its own script tag
    const script = document.createElement('script');
    script.src = url;
    script.id = packageName;
    document.body.appendChild(script);
    script.onload = () => {
      npmTheme[packageName] = window[varName][name];
      setTheme(npmTheme[packageName]);
    };
  } else {
    setTheme(npmTheme[packageName]);
  }
};

export const loadTheme = (themeValue, setTheme) => {
  const theme = themeForValue(themeValue);
  const designerUrl =
    (theme && theme.designerUrl) ||
    (themeValue.match('theme-designer.grommet.io') && themeValue);
  if (designerUrl) {
    const id = designerUrl.split('id=')[1];
    fetch(`${themeApiUrl}/${id}`)
      .then(response => response.json())
      .then(setTheme);
  } else if (theme && theme.jsUrl) {
    // this is from npmjs or github pages
    // e.g. https://unpkg.com/grommet-theme-hpe/dist/grommet-theme-hpe.min.js
    const { packageName, name } = theme;
    loadThemePackage({ name, packageName, url: theme.jsUrl, setTheme });
  } else if (typeof themeValue === 'string') {
    // see if we can guess the packageName and name
    const urlTheme = themeForUrl(themeValue);
    if (urlTheme) {
      const { packageName, name } = urlTheme;
      loadThemePackage({ name, packageName, url: themeValue, setTheme });
    } else {
      setTheme(grommet);
    }
  } else {
    setTheme(grommet);
  }
};

export const loadImports = (imports, setImports) => {
  imports.forEach(impor => {
    const url = impor.url;
    if (url) {
      if (url.includes('id=')) {
        // looks like another design
        if (!impor.design) {
          const id = url.split('id=')[1];
          loadDesign({
            id,
            onLoad: importDesign => {
              setImports(prevImports => {
                const nextImports = [...prevImports];
                const nextImport = { ...impor, design: importDesign };
                const index = nextImports.findIndex(i => i.url === url);
                if (index !== -1) nextImports[index] = nextImport;
                else nextImports.push(nextImport);
                return nextImports;
              });
            },
          });
        }
      } else {
        // assume it is a package of components
        if (!impor.library) {
          const script = document.createElement('script');
          script.src = url;
          document.body.appendChild(script);
          script.onload = () => {
            setImports(prevImports => {
              const nextImports = [...prevImports];
              // nextImports[index] = { ...impor, library: window[name].designer };
              return nextImports;
            });
          };
        }
      }
    }
  });
};
