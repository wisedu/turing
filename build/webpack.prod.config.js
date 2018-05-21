var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var webpackBaseConfig = require('./webpack.base.config.js');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var fs = require('fs');
var file = "./package.json";
var packageJSON = JSON.parse(fs.readFileSync(file));

var themeFile = fs.readFileSync('./runtime/theme.css', 'utf-8');
var match = themeFile.match(/^\/\*COLOR_THEME:([^\*]+)\*\//);
if (match.length > 1) {
  process.env.COLOR_THEME = match[1];
}

process.env.NODE_ENV = 'production';


let config = merge(webpackBaseConfig, {
    entry: {
        main: './entry.js'
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: packageJSON.packageName + '.min.js',
        library: packageJSON.packageName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    
    externals: {
        vue: {
            root: 'Vue',
            commonjs: 'vue',
            commonjs2: 'vue',
            amd: 'vue'
        }
    },
    plugins: [
        // @todo
        new ExtractTextPlugin({filename: 'style/' + process.env.COLOR_THEME + '/'+packageJSON.packageName+'.css', allChunks: true}),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
    ],
    devtool: 'source-map'
});

config.module = {
  rules: [{
      // https://vue-loader.vuejs.org/en/configurations/extract-css.html
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: {
          css: ExtractTextPlugin.extract({
            use: [
                { loader: 'css-loader', options: { sourceMap: 'inline', minimize: true } },
                { loader: 'postcss-loader', options: { sourceMap: 'inline', minimize: true } }],
            fallback: 'vue-style-loader'
          }),
          postcss: ExtractTextPlugin.extract({
            use: [{ loader: 'css-loader', options: { sourceMap: 'inline', minimize: true } },
                { loader: 'postcss-loader', options: { sourceMap: 'inline', minimize: true } }],
            fallback: 'vue-style-loader'
          })
        },
        postLoaders: {
          html: 'babel-loader'
        }
      }
    },
    {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    },
    {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
            { loader: 'css-loader', options: { sourceMap: 'inline', minimize: true } },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: 'inline',
                minimize: true
            }
          },
          'autoprefixer-loader'
        ]
      })
    },
    {
      test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
      loader: 'url-loader?limit=8192'
    },
    {
      test: /\.(html|tpl)$/,
      loader: 'html-loader'
    }
  ]
}

module.exports = config;