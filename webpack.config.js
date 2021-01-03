const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'spectrum-to-rgb.js',
    library: 'SpectrumToRGB',
    libraryTarget: 'umd'
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: [
        "ts-loader"
      ],
      exclude: /node_modules/,
    }],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
};
