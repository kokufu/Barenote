const merge = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
    mode: 'production',
    output: {
        path: `${__dirname}/lib`,
        filename: 'index.min.js',
        libraryTarget: 'commonjs2'
    }
})

delete module.exports.output.library
delete module.exports.output.libraryExport
