module.exports = {
    mode: 'development',
    entry: './src/barenote.js',
    output: {
        path: `${__dirname}/dist`,
        filename: 'barenote.js',
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
            }
        ]
    },
}