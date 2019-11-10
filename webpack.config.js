var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: {
        'index': './src/index.ts'
    },
    mode: "production",
    output: {
        path: __dirname,
        filename: '[name].js',
        libraryTarget: 'commonjs',
        umdNamedDefine: true
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/
        }]
    }
};
