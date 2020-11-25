const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require("path");

module.exports = {
    entry:"./app/renderer.js",
    output:{
        path: path.resolve(__dirname, './app/dist'),
        filename:'renderer.js',
        publicPath:'app/dist/'
    },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  devtool:'eval-sourcemap'
}