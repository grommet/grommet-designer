import { grommet } from 'grommet';

const themeDesignerUrl = `https://theme-designer.grommet.io`;
const themesApiUrl =
  'https://us-central1-grommet-designer.cloudfunctions.net/themes';

const themes = [
  {
    name: 'aruba',
    packageName: 'grommet-theme-aruba',
    designerUrl:
      'https://theme-designer.grommet.io/?id=aruba-eric-soderberg-hpe-com',
  },
  {
    name: 'dark',
    designerUrl:
      'https://theme-designer.grommet.io/?id=dark-eric-soderberg-hpe-com',
  },
  {
    name: 'dxc',
    packageName: 'grommet-theme-dxc',
    designerUrl:
      'https://theme-designer.grommet.io/?id=dxc-eric-soderberg-hpe-com',
  },
  {
    name: 'hp',
    packageName: 'grommet-theme-hp',
    designerUrl:
      'https://theme-designer.grommet.io/?id=hp-eric-soderberg-hpe-com',
  },
  {
    name: 'hpe',
    packageName: 'grommet-theme-hpe',
    // packageUrl: 'https://github.com/grommet/grommet-theme-hpe/tarball/stable',
    jsUrl:
      'https://grommet.github.io/grommet-theme-hpe/grommet-theme-hpe.min.js',
  },
  {
    name: 'hpe-1',
    packageName: 'grommet-theme-hpe',
    // packageUrl: 'https://github.com/grommet/grommet-theme-hpe/tarball/v1.0.5',
    jsUrl:
      'https://grommet.github.io/grommet-theme-hpe/grommet-theme-hpe-1.min.js',
  },
  {
    label: 'hpe-0',
    packageName: 'grommet-theme-hpe',
    designerUrl:
      'https://theme-designer.grommet.io/?id=HPE-0-eric-soderberg-hpe-com',
  },
  {
    label: 'hpe-next',
    name: 'hpe',
    packageName: 'grommet-theme-hpe',
    // packageUrl:
    //   'https://github.com/grommet/grommet-theme-hpe/tarball/NEXT-stable',
    jsUrl:
      'https://grommet.github.io/grommet-theme-hpe/grommet-theme-hpe-next.min.js',
  },
];

export default themes;

export const themeForValue = (value) => {
  let result = themes.find(
    (theme) =>
      theme.packageName === value ||
      theme.jsUrl === value ||
      theme.designerUrl === value ||
      theme.name === value ||
      theme.label === value,
  );
  if (!result && value.startsWith(themeDesignerUrl)) {
    // e.g. https://theme-designer.grommet.io/?id=hacktoberfest2022-eric-soderberg-hpe-com
    const id = value.split('=')[1];
    const name = id.split('-')[0];
    result = {
      name,
      designerUrl: `${themesApiUrl}/${id}`,
    };
  }
  return result;
};

const npmTheme = {};

const loadThemePackage = async ({ url, name, packageName }) => {
  const nameParts = packageName.split('-'); // [grommet, theme, hpe]
  const varName = nameParts
    .map((p) => `${p[0].toUpperCase()}${p.slice(1)}`)
    .join(''); // GrommetThemeHpe
  if (!document.getElementById(packageName)) {
    // we haven't loaded this theme, add it in its own script tag
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.id = packageName;
      document.body.appendChild(script);
      script.onload = () => {
        try {
          npmTheme[packageName] = window[varName][name];
          resolve(npmTheme[packageName]);
        } catch {
          reject(undefined);
        }
      };
    });
  }
  return npmTheme[packageName];
};

const loadDesignerTheme = async ({ name, url }) => {
  if (npmTheme[name]) return npmTheme[name];
  return fetch(url)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(response.status);
    })
    .then((pubTheme) => {
      npmTheme[name] = pubTheme;
      return pubTheme;
    });
};

export const loadTheme = async (themeValue) => {
  const themeDesc = themeForValue(themeValue);
  if (themeDesc?.jsUrl) {
    const { packageName, name, jsUrl: url } = themeDesc;
    return await loadThemePackage({ name, packageName, url });
  }
  if (themeDesc?.designerUrl) {
    const { name, designerUrl: url } = themeDesc;
    return await loadDesignerTheme({ name, url });
  }
  return grommet;
};
