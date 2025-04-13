const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.mjs',
    path: path.resolve(__dirname, 'dist'),
    library: { type: 'module' },
    chunkFormat: 'module'
  },
  target: 'node',
  experiments: { outputModule: true },
  mode: 'production'
};
