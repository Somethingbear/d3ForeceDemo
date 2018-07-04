const path = require('path');
const webpack = require('webpack');

const srcPath = path.resolve(__dirname, 'src');
const distPath = path.resolve(__dirname, 'dist');

module.exports = {
    context: srcPath,
    /*resolve: {
        alias: {
            components: path.resolve(srcPath, 'components'),
            api: path.resolve(srcPath, 'api'),
            images: path.resolve(srcPath, 'images')
        }
    },*/
    entry: {
        index: './index.js',
    },
    output: {
        path: distPath,
        filename: '[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options : {
                            url: false
                        }
                    }
                ]
            }
        ]
    },

    plugins: [

        new webpack.ProvidePlugin({ //全局化变量
            //当webpack碰到require的第三方库中出现全局的$、jQeury和window.jQuery时，就会使用node_module下jquery包export出来的东西
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            "d3": "d3",
            "_": "underscore",
            "dialog": "art-dialog",
            "svg2Png": "save-svg-as-png",
            "XLSX":"xlsx"
        }),
        
        //new webpack.HotModuleReplacementPlugin(), //热加载
        /* 
        new webpack.optimize.CommonsChunkPlugin({
                name: "common", // 将公共模块提取，生成名为`common`的chunk
                chunks: ["home"], //提取哪些模块共有的部分，默认所有
                filename: "js/common.js",
                minChunks: 2 // 提取至少2个模块共有的部分
            }),
            new uglifyJsPlugin({
                compress: {
                    warnings: false,
                    drop_console: true //删除console
                }
            }),
         */

    ],
    devServer: {
        contentBase: distPath,
        compress: true,
        progress: true,
        port: 8081,
        proxy: {
            '/api/*': {
                target: 'http://127.0.0.1:8080/',
                secure: false,
                changeOrigin: true
            }
        }
    },
    devtool: 'cheap-source-map'
};

