const webpack = require('webpack')

module.exports = {
    entry: './src/barenote.js',
    output: {
        path: `${__dirname}/dist`,
        library: 'Barenote',
        libraryExport: 'default',
        libraryTarget: 'var',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: true,
                            interpolate: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(require("./package.json").version)
          })
    ]
}