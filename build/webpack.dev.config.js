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
    //   '/axsfw/code/80f9d8aa-d053-4312-b725-016642b74e3e.do': {
    //     target:"http://localhost:8082/static/json/jbxx/80f9d8aa-d053-4312-b725-016642b74e3e.do",
    //     changeOrigin: true
    //   }
      // '/axsfw/code/80f9d8aa-d053-4312-b725-016642b74e3e.do':"/static/json/jbxx/80f9d8aa-d053-4312-b725-016642b74e3e.do"
    }
  },
  performance: {
    hints: false
  },
  devtool: '#cheap-module-eval-source-map'
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