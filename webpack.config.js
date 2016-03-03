var path = require('path')
module.exports = {
  entry: "./entry.js",
  output: {
    path: path.join(__dirname,'www','bundle'),
    filename: "bundle.js",
    publicPath:"bundle/"
  },
  module: {
    loaders: [
      { test: /\.jade$/, loader: "jade-loader" },
      { test: /\.json$/, loader: "json-loader" },

      { test: /\.png$/, loader: "url-loader?limit=300000"},
      { test: /\.jpg$/, loader: "file-loader" },
      { test: /\.css$/, loader: "style-loader!css-loader" },

      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  }
};