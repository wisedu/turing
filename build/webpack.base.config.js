/**
 * 公共配置
 */
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  // 加载器
  module: {
    rules: [{
        // https://vue-loader.vuejs.org/en/configurations/extract-css.html
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: ['vue-style-loader', 'css-loader',{ loader: 'postcss-loader', options: { sourceMap: 'inline' } }],
            postcss: ['vue-style-loader', 'css-loader', { loader: 'postcss-loader', options: { sourceMap: 'inline' } }]
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
        loader: ['style-loader', 'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: 'inline'
          }
        },
        'autoprefixer-loader']
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
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: [
      'src',
      'node_modules'
    ],
    alias: {
      'vue': 'vue/dist/vue.esm.js',
      'vue$': 'vue/dist/vue.common.js',
      '@': resolve('src')
    }
  }
};