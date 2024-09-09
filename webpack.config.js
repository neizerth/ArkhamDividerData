const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  entry: "./src/index.ts",
  target: 'node',
  output: {
    filename: "app.js",
    path: __dirname + '/build'
  },
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({
        baseUrl: __dirname
      })
    ],
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  module: {
    rules: [
      // all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.([cm]?ts|tsx)$/, loader: "ts-loader" }
    ]
  }
}