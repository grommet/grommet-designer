import { grommet } from 'grommet';
import ReactGA from 'react-ga';
import themes from '../themes';
import { setupDesign } from './reset';
import { upgradeDesign } from './upgrade';
import { bare } from './bare';

const apiUrl =
  'https://us-central1-grommet-designer.cloudfunctions.net/designs';

export const loadDesign = (id, setDesign, initial) => {
  if (id === '_new') {
    const design = setupDesign(bare);
    upgradeDesign(design);
    setDesign(design);
    ReactGA.event({ category: 'switch', action: 'force new design' });
  } else if (id) {
    fetch(`${apiUrl}/${id}`)
      .then(response => response.json())
      .then(design => {
        upgradeDesign(design);
        setDesign(design);
        if (initial)
          ReactGA.event({ category: 'switch', action: 'published design' });
      });
  } else {
    let stored = localStorage.getItem('activeDesign');
    if (stored) stored = localStorage.getItem(stored);
    if (stored) {
      const design = JSON.parse(stored);
      upgradeDesign(design);
      setDesign(design);
      ReactGA.event({ category: 'switch', action: 'previous design' });
    } else {
      const design = setupDesign(bare);
      upgradeDesign(design);
      setDesign(design);
      ReactGA.event({ category: 'switch', action: 'new design' });
    }
  }
};

const themeApiUrl =
  'https://us-central1-grommet-designer.cloudfunctions.net/themes';

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

let libraries = [];

export const loadLibraries = (library, setLibraries) => {
  if (library) {
    Object.keys(library).forEach(name => {
      const url = library[name];
      if (name && url && !document.getElementById(name)) {
        // add library
        const script = document.createElement('script');
        script.src = url;
        script.id = name;
        document.body.appendChild(script);
        script.onload = () => {
          libraries = [window[name].designer, ...libraries];
          setLibraries(libraries);
        };
      } else {
        setLibraries(libraries);
      }
    });
  } else setLibraries(libraries);
};
