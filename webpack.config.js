//const { dirname } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');


module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',

    },

    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,        
                use: ['style-loader', 'css-loader'],        
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,        
                type: 'asset/resource',        
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,        
                type: 'asset/resource',
            },
        ],
    },
    devtool: 'inline-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'todo list',
            template: path.resolve(__dirname, 'src/index.html')
        }),
    ],
};