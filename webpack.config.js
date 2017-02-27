let path = require('path');
let webpack = require('webpack');

let DevServer = require('webpack-dev-server');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');

// 获取当前运行的模式
var currentTarget = process.env.npm_lifecycle_event;

var debug,          // 是否是调试
    devServer,      // 是否是热更新模式
    minimize;       // 是否需要压缩

if (currentTarget == 'build') {
    debug = false, 
    devServer = false, 
    minimize = true;
} else if (currentTarget == 'develop') {
    debug = true, 
    devServer = true, 
    minimize = false;
};

const ASSET_PATH = devServer ? '/dist' : './dist';

module.exports = {
    entry: {
        'vendor': ['jquery'],
        'datepicker': './js/datepicker/index.js',
        'overlay': './js/overlay/index.js',
        'mul-ui': './js/mul-ui.js',
        'index': './usage/index.js'
    },
    output: {
        path: ASSET_PATH,
        filename: devServer ? 'js/[name].js' : 'js/[name].min.js',
        chunkFilename: devServer ? 'js/[name].js' : 'js/[name].min.js',
        publicPath: 'http://localhost:3030/',
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
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            // 全局debug标识
            __DEV__: debug,
        }),    
        new webpack.HotModuleReplacementPlugin({
            multiStep: true
        }),        
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor', 
            filename: devServer ? 'vendor.bundle.js': 'vendor.bundle.min.js'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),        
        new ExtractTextPlugin(devServer ? 'css/[name].css' : 'css/[name].min.css'),
        (devServer ? {apply: function() {}} : new webpack.optimize.UglifyJsPlugin({
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
            },
            static: {
                'vendor': '/js/vendor.bundle.js',
                'mulUi': {
                    js: '/js/mul-ui.js',
                    css: '/css/mul-ui.css'
                },
                'index': '/js/index.js'
            }
        })
    ],
    devServer:{
        hot: true,
        inline: true,
        stats: 'errors-only',
        host: 'localhost',
        port: '3030'
    }
};