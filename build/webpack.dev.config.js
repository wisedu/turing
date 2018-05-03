var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge');
var webpackBaseConfig = require('./webpack.base.config.js');

module.exports = merge(webpackBaseConfig, {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.s'
  },
  devServer: {
    disableHostCheck: true,
    historyApiFallback: true,
    noInfo: true,
    host: '0.0.0.0',
    port: 8082,
    proxy: {
      '/emap/sys/student_app1.2/*default/index.do': {
        bypass: function(req, res, proxyOptions) {
          if (req.url.indexOf('index.do') > -1) {
            return '/index.html'
          } else {
            return req.url.replace('/emap/sys/student_app1.2/*default', '')
          }
        }
      } 
    }
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
});

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  module.exports.output.publicPath = './dist/';
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
        COLOR_THEME: '"blue"'
      },
      "WEBPACK_CONIFG_HOST": 'location.origin + location.pathname.substring(0, location.pathname.indexOf("/", 1)) + "/"'
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
  ])
} else if (process.env.NODE_ENV === 'development') {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      },
      "WEBPACK_CONIFG_HOST": '"http://amptest.wisedu.com/xsfwfw/"'
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
  ])
}