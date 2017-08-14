var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-eval-source-map',
  entry: {
    app:[
    'webpack-hot-middleware/client',
    './src/client/client.js'
  ],
},

  output: {
    path: require("path").resolve("./src/dist"),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: ['/node_modules/','/src/server/','/src/client',],
        query: {
          presets: ['react', 'es2015','stage-0', 'react-hmre'],
          cacheDirectory: true
        },
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  }
}
