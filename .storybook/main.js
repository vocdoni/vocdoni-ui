const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path')
module.exports = {
  "stories": [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  "framework": "@storybook/react",
  webpackFinal: async (config) => {
    config.resolve.roots = [path.resolve(__dirname, '../public')];
    config.resolve.alias = {
      ...config.resolve.alias,
      'fs': path.resolve(__dirname, 'fsMock.js')
    }
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions,
      }),
    ]
    return config
  },
}
