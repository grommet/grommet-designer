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
    packageUrl: 'https://github.com/grommet/grommet-theme-hpe/tarball/stable',
    jsUrl:
      'https://grommet.github.io/grommet-theme-hpe/grommet-theme-hpe.min.js',
  },
  {
    label: 'hpe-next',
    name: 'hpe',
    packageName: 'grommet-theme-hpe',
    packageUrl:
      'https://github.com/grommet/grommet-theme-hpe/tarball/NEXT-stable',
    jsUrl:
      'https://grommet.github.io/grommet-theme-hpe/grommet-theme-hpe-next.min.js',
  },
  {
    label: 'hpe-0',
    packageName: 'grommet-theme-hpe',
    designerUrl:
      'https://theme-designer.grommet.io/?id=HPE-0-eric-soderberg-hpe-com',
  },
];

export default themes;

export const themeForValue = value =>
  themes.find(
    theme =>
      theme.packageName === value ||
      theme.jsUrl === value ||
      theme.designerUrl === value,
  );

export const themeForUrl = url =>
  themes.find(theme => url.search(`/${theme.packageName}/`) !== -1);
