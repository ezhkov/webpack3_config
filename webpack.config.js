const NODE_ENV = process.env.NODE_ENV || 'development';

const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const CssoWebpackPlugin = require('csso-webpack-plugin').default;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const commonPlugins = [
  new WebpackNotifierPlugin(),
  // new BundleAnalyzerPlugin(),
  new ExtractTextPlugin({
    filename: 'css/style.css',
    allChunks: true,
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'shared',
    minChunks: 2,
  }),
  new webpack.ProvidePlugin({
    _: 'underscore',
  }),
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/),
];


module.exports = {
  entry: glob.sync('./src/js/pages/*.js').reduce((entries, entry) => Object.assign(entries, { [entry.replace('./src/js/pages/', '').replace('.js', '')]: entry }), {}),
  output: {
    path: __dirname + '/dist',
    publicPath: '/dist/',
    filename: 'js/[name].js',
  },
  watch: NODE_ENV === 'development',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: 'vue-style-loader!css-loader!sass-loader',
            sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
          },
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [['es2015', { modules: false }], ['stage-2']],
        },
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              minimize: NODE_ENV !== 'development',
            },
          }, {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                autoprefixer({ browsers: ['last 3 versions', 'IE > 9', 'Safari 9.1'] }),
              ],
            },
          }, {
            loader: 'sass-loader',
          }],
        }),
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|svg)$/,
        loader: 'file?name=[path][name].[ext]',
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: 'file?name=[name].[ext]',
      },
    ],
  },
  plugins: NODE_ENV === 'development' ? commonPlugins : [...commonPlugins,
    new CssoWebpackPlugin({ sourceMap: true }),
    new UglifyJsPlugin({
      beautify: false,
      comments: false,
      compress: {
        sequences: true,
        booleans: true,
        loops: true,
        unused: true,
        warnings: false,
        drop_console: true,
        unsafe: true,
      },
    }),

  ],
  resolve: {
    extensions: ['.js'],
    alias: {
      vue: 'vue/dist/vue.js',
    },
  },
};
