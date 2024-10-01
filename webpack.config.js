const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    mode: 'development',
    output: {
        publicPath: '',
        filename: 'genome_viewer.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'GenomeViewer',
    },
    resolve: {
        fallback: {
            stream: require.resolve("stream-browserify"),
            assert: require.resolve("assert"),
            http: require.resolve("stream-http"),
            https: require.resolve("https-browserify"),
            os: require.resolve("os-browserify"),
            url: require.resolve("url"),
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {

                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]

            }
        ],

    },
};