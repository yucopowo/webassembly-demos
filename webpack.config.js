const path = require('path')

module.exports = {
    mode: 'none',
    resolve: {
        extensions: [".walt",".js"]
    },
    module: {
        rules: [
            { test: /\.walt$/, use: 'walt-loader' },
            { test: /\.md$/, use: 'text-loader' }
        ]
    },
    entry: './src/test.js',
    // mode: 'production',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    node: {
        fs: "empty"
    }
};