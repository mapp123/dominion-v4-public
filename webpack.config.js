let MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const HtmlOutputPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
let extractSass = new MiniCssExtractPlugin({
  filename: '../css/[name].css',
  chunkFilename: '[id].css'
});
const cardTest = /\.\/(.*?)\/(.*?)\.ts/;
let unknown = 0;
const chunkNames = new webpack.NamedChunksPlugin((chunk) => {
  if (chunk.name) {
    return chunk.name;
  }
  for (let m of chunk._modules) {
    if (cardTest.test(m.rawRequest)) {
      cardTest.lastIndex = 0;
      const [, set, cardName] = cardTest.exec(m.rawRequest);
      return `cards/${set}/${cardName}`;
    }
  }
  // Hack to return first module ID
  for (let m of chunk._modules) {
    return m.debugId;
  }
  return `unid-${unknown++}`;
});
module.exports = {
  entry: {
    main: './src/client/app.tsx',
    css: './src/client/style.scss'
  },
  output: {
    filename: '[name].js',
    path: __dirname + "/dist/js",
    publicPath: "/js/"
  },
  devtool: "source-map",
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  plugins: [
      extractSass,
      chunkNames
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development'
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all"
    }
  }
};