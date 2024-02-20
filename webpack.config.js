const path = require('path');
const webpack = require('webpack');
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');

module.exports = (env, argv) => ({
mode: argv.mode === 'production' ? 'production' : 'development',

// This is necessary because Figma's 'eval' works differently than normal eval
devtool: argv.mode === 'production' ? false : 'inline-source-map',
  entry: {
    code: './src/code.js' // This is the entry point for our plugin code.
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.(css)$/,
        use: ['css-loader'],
      },
    ],
  },
  // Webpack tries these extensions for you if you omit the extension like "import './file'"
  resolve: {
    extensions: ['.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),  
  },
  plugins: [
    new HtmlBundlerPlugin({
      entry: {
        ui: 'src/ui.html',
      },
      js: {
        // adds JavaScript to the DOM by injecting a `<script>` tag
        inline: true,
      },
      css: {
        // adds CSS to the DOM by injecting a `<style>` tag
        inline: true,
      }
    }),
  ],
  watch: true
});