const path = require('path');

module.exports = {
  
  watch: false,
  
  mode: 'development',

  entry: {
    'okiniri': ['./src/index.ts'],
  },
  
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist/browser'),
    library: '',
    libraryExport: '',
    libraryTarget: 'umd',
    globalObject: 'this',
  }
}