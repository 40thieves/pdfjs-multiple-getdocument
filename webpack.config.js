const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: "none",
  entry: {
    main: "./main.js"
  },
  output: {
    path: path.join(__dirname, "./dist"),
    filename: "[name].js"
  },
  plugins: [
    new CopyPlugin(['./basicapi.pdf', './helloworld.pdf']),
    new HtmlPlugin({ template: 'index.html' })
  ]
};
