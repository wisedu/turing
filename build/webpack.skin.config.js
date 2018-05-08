var ExtractTextPlugin = require('extract-text-webpack-plugin');

let config = {
    entry: {
        main: "由buildskin.js的地方修改该参数"
    },
    output: {
        filename:""
    },
    plugins: [],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            }
        ]
    }
};

module.exports = config;