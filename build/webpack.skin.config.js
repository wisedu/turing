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
                    use: [{
                        loader:'css-loader',
                        options: {
                            minimize: true
                        }                        
                    }, {
                        loader:'sass-loader',
                        options: {
                            minimize: true
                        }
                    }]
                })
            }
        ]
    }
};

module.exports = config;