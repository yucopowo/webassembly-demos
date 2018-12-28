const path = require('path')

module.exports = {
    mode: 'none', // mode: 'production',
    resolve: {
        extensions: [".walt",".js"]
    },
    module: {
        rules: [
            { test: /\.walt$/, use: 'walt-loader' },
            { test: /\.md$/, use: 'text-loader' }
        ]
    },
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    node: {
        fs: "empty"
    }
};