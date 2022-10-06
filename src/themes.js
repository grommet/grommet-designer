import { grommet } from 'grommet';

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
      'https://grommet.github.io/grommet-theme-hpe/grommet-theme-hpe-2.min.js',
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

export const themeForValue = (value) =>
  themes.find(
    (theme) =>
      theme.packageName === value ||
      theme.jsUrl === value ||
      theme.designerUrl === value ||
      theme.name === value ||
      theme.label === value,
  );

export const themeForUrl = (url) =>
  themes.find((theme) => url.search(`/${theme.packageName}/`) !== -1);

const npmTheme = {};

export const loadThemePackage = async ({ url, name, packageName }) => {
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

export const loadTheme = async (themeValue) => {
  const themeDesc = themeForValue(themeValue);
  if (themeDesc?.jsUrl) {
    const { packageName, name } = themeDesc;
    return await loadThemePackage({ name, packageName, url: themeDesc.jsUrl });
  }
  return grommet;
};
