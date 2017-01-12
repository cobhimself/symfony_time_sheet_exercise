var webpack = require('webpack');

module.exports = {
    entry: [
        './web/assets/js/app.js'
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
            }
        ]
    },
    output: {
        filename: 'app.js',
        path: __dirname + '/web/assets/dist/js/'
    }
};
