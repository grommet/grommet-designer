const {
  override,
  addWebpackExternals,
  addWebpackPlugin,
} = require('customize-cra');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = override(
  addWebpackExternals({
    react: 'React',
    'react-dom': 'ReactDOM',
    grommet: 'Grommet',
    'grommet-icons': 'GrommetIcons',
    'styled-components': 'styled',
  }),
  addWebpackPlugin(
    new CopyWebpackPlugin([
      { from: './node_modules/grommet/grommet.min.js' },
      { from: './node_modules/grommet-icons/grommet-icons.min.js' },
    ]),
  ),
);
