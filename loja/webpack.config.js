var webpack = require('webpack');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var config = {
    context: __dirname + '/app',
    entry: './index.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },

    devServer: {
        inline: true,
        setup: function(app) {
            app.get(/^[^.]*$/, function(req, res) {
                res.sendFile(
                    'index.html', {
                        root: __dirname + '/app/'
                    }
                );
            });
        },
        host: '0.0.0.0',
        disableHostCheck: true
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.bundle.js'
        }),
        new CopyWebpackPlugin([
            { from: __dirname + '/app/assets', to: 'assets' },
            { from: __dirname + '/app/browserconfig.xml', to: 'browserconfig.xml'}
        ]),
    ],

    module: {
        loaders: [
            { test: /\.js$/, loader: 'jshint-loader!ng-annotate-loader', exclude: /node_modules/ },
            { test: /\.html$/, loader: 'raw-loader', exclude: /node_modules/ },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.(sass|scss)$/, loader: 'style-loader!css-loader!sass-loader', exclude: /node_modules/ },
            { test: /\.(jpe?g|png|gif)$/i, loader: 'url-loader?limit=30000&name=images/[name].[ext]', include : path.join(__dirname, '/app/assets') },
            { test: /\.svg$/, loader: 'svg-url-loader' }
        ]
    }
};

if (process.env.NODE_ENV === 'production') {
    config.output.path = __dirname + '/dist';
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        mangle: {
            except: ['$q', '$ocLazyLoad']
        },
        sourceMap: true
    }));
    config.devtool = 'source-map';
}

module.exports = config;
