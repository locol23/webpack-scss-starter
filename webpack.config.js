const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const AutoPrefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackNotifierPlugin = require('webpack-notifier')

module.exports = [
  {
    entry: {
      main: ['./src/js/index.js', './src/scss/style.scss'],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/[name].js',
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [AutoPrefixer()],
              },
            },
            {
              loader: 'sass-loader',
            },
          ],
        },
        {
          test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
          use: [
            {
              loader: 'url-loader?limit=100000&name=img/[name].[ext]',
            },
          ],
        },
      ],
    },
    optimization: {
      minimizer: [new OptimizeCSSAssetsPlugin()],
    },
    resolve: {
      extensions: ['.js'],
    },
    plugins: [
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, 'src/img/'),
          to: path.resolve(__dirname, 'dist/img/'),
        },
      ]),
      new MiniCssExtractPlugin({
        filename: 'css/style.css',
      }),
      new ImageminPlugin({
        test: /\.(jpe?g|png|gif|svg)$/i,
        pngquant: {
          quality: '95-100',
        },
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html',
        minify: { removeComments: true, collapseWhitespace: true },
      }),
      new WebpackNotifierPlugin(),
    ],
    devServer: {
      contentBase: './dist',
      watchContentBase: true,
      port: 8000,
      open: true,
      historyApiFallback: true,
    },
  },
]
