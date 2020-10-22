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
    new CopyWebpackPlugin({
      patterns: [
        { from: './node_modules/grommet/grommet.min.js' },
        { from: './node_modules/grommet-icons/grommet-icons.min.js' },
        { from: './node_modules/react/umd/react.production.min.js' },
        { from: './node_modules/react-dom/umd/react-dom.production.min.js' },
        { from: './node_modules/react-is/umd/react-is.production.min.js' },
        {
          from:
            './node_modules/styled-components/dist/styled-components.min.js',
        },
      ],
    }),
  ),
);
