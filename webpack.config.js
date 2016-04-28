var webpack = require('webpack')
var path = require('path')
var loaders = [
  { test: /\.jade$/, loader: "jade-loader" },
  { test: /\.json$/, loader: "json-loader" },

  { test: /\.png$/, loader: "url-loader?limit=300000"},
  { test: /\.jpg$/, loader: "file-loader" },
  { test: /\.css$/, loader: "style-loader!css-loader" },

  { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
  { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
]

var dist = {
  entry: "./entry.js",
  devtool:"#source-map",
  output: {
    path: path.join(__dirname,'www','dist'),
    filename: "bundle.js"
    ,publicPath:"dist/"
  },
  module: {
    loaders: loaders
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ]
}

var debug = {
  entry: "./entry.js",
  devtool:"#source-map",
  output: {
    path: path.join(__dirname,'www','dist'),
    filename: "bundle.js"
    ,publicPath:"dist/"
  },
  module: {
    loaders: loaders
  }
}

module.exports = [debug];