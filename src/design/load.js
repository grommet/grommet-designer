import { grommet } from 'grommet';
import ReactGA from 'react-ga';
import themes from '../themes';
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

export const loadTheme = (theme, setTheme) => {
  const themeUrl = themes[theme] || theme;
  if (typeof themeUrl === 'string' && themeUrl.slice(0, 4) === 'http') {
    // this could be from the theme designer or from npmjs
    const id = themeUrl.split('id=')[1];
    if (id) {
      // this is from the theme designer
      fetch(`${themeApiUrl}/${id}`)
        .then(response => response.json())
        .then(setTheme);
    } else if (themeUrl.match('grommet-theme-')) {
      // this is from npmjs
      // e.g. https://unpkg.com/grommet-theme-hpe/dist/grommet-theme-hpe.min.js
      const name = themeUrl.split('/')[3].split('.')[0]; // grommet-theme-hpe
      const nameParts = name.split('-'); // [grommet, theme, hpe]
      const varName = nameParts
        .map(p => `${p[0].toUpperCase()}${p.slice(1)}`)
        .join(''); // GrommetThemeHpe
      const subName = nameParts[2]; // hpe
      if (!document.getElementById(name)) {
        // we haven't loaded this theme, add it in its own script tag
        const script = document.createElement('script');
        script.src = themeUrl;
        script.id = name;
        document.body.appendChild(script);
        script.onload = () => {
          npmTheme[name] = window[varName][subName];
          setTheme(npmTheme[name]);
        };
      } else {
        setTheme(npmTheme[name]);
      }
    } else {
      setTheme(grommet);
    }
  } else if (typeof themeUrl === 'object') {
    setTheme(themeUrl);
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
