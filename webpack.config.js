var path = require('path')
module.exports = {
    entry: "./entry.js",
    output: {
        path: path.join(__dirname,'www'),
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.jade$/, loader: "jade-loader" }
/*
            { test: /\.css$/, loader: "style!css" }
*/
        ]
    }
};