const merge = require('webpack-merge')
const common = require('./webpack.common')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = merge(common, {
    mode: 'development',
    output: {
        filename: 'barenote.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/__dev__/index.html'
        }),
        new CopyPlugin([
            { context: 'src/__dev__', from: '**/*.css' }
        ]),
    ],
    devServer: {
        contentBase: './dist'
    }
})
