let path = require('path');
let webpack = require('webpack');

let DevServer = require('webpack-dev-server');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');

// 获取当前运行的模式
let isProd = process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
        'vendor': ['jquery'],
        'modal': './js/modal/index.js',
        'picker': './js/picker/index.js',        
        'calendar': './js/calendar/index.js',
        'mul': './js/index.js',
        'usage': './usage/index.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: isProd ? 'js/[name].min.js' : 'js/[name].js',
        chunkFilename: isProd ? 'js/[name].min.js' : 'js/[name].js',
        publicPath: '/',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            { test: /\.less$/, loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'less-loader']
            })},
            { 
                test: /\.js$/, 
                loader: 'babel-loader' 
            },
            { 
                test: /\.(png|jpg|gif)$/, 
                loader: 'url-loader?limit=8192&name=./img/[hash].[ext]'
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=./iconfonts/[name].[ext]'                
            }            
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin({
            multiStep: true
        }),        
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor', 
            filename: isProd ? 'vendor.bundle.min.js' : 'vendor.bundle.js'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),        
        new ExtractTextPlugin(isProd ? 'css/[name].min.css': 'css/[name].css'),
        (!isProd  ? { apply: function() {} } : new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            },
            except: ['$', 'exports', 'require'],
            sourceMap: true
        })),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './usage/index.ejs',
            inject: true,
            hash: true,
            minify: {                            
                removeComments: true,
                collapseWhitespace: true
            }        
        })
    ],
    devServer:{
        hot: false,
        inline: false,
        stats: { colors: true },
        host: 'localhost',
        port: '3030'
    }
};