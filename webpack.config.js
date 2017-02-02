var webpack = require('webpack'),
    path = require('path');

module.exports = {
    entry: [
        './web/assets/js/app.js',
        './web/assets/sass/styles.sass'
    ],
    module: {
        loaders: [
            {
                test: /\.(jsx|js)$/,
                include: __dirname + '/web/assets/js',
                loader: "babel-loader",
                query: {
                    presets: ['es2015', 'react']
                }
            }, {
                test: /\.sass$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            }

        ]
    },
    sassLoader: {
        includePaths: [path.resolve(__dirname, "web/assets/sass")]
    },
    output: {
        filename: 'app.js',
        path: __dirname + '/web/assets/dist/js/'
    }
};
