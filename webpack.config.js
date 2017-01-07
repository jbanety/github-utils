'use strict';

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
	entry: [
		path.join(__dirname, 'www/src/app.js')
	], 
	output: {
		path: path.join(__dirname, 'www/build/'),
		filename: 'app.js'
	},
    devtool: 'source-map',
    plugins: [

		// output a separate css bundle
		new ExtractTextPlugin('app.css', {
            allChunks: true
        }),

		// reloads browser when the watched files change
		new BrowserSyncPlugin({
			// use existing Apache virtual host
			proxy: 'https://github/',
			tunnel: true,
			// watch the built files and the index file
			files: ['www/build/*', 'www/index.html']
		}),

		// set node env
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('development')
		})
	], 
	module: {
		loaders: [
			// transpiles JSX and ES6
			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel' },

			// makes jQuery available to Bootstrap js
			{ test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' },

			// extracts css as separate output file
			{ test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css') },

			// sass
            { test: /\.scss$/, loader: ExtractTextPlugin.extract('css!sass') },

			// loads font icons for Bootstrap css
			{ test: /\.woff(2?)(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
			{ test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
			{ test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
			{ test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },

			{ test: /\.json$/, loader: 'json' },

            { test: /\.(jpe?g|png|gif|svg)$/i, loaders: [ 'file?hash=sha512&digest=hex&name=[hash].[ext]', 'image-webpack' ] }
		]
	}, 
	// needed to make request-promise work
	node: {
        fs: 'empty',
		net: 'empty',
		tls: 'empty'
	},
    // image webpack
    imageWebpackLoader: {
        mozjpeg: {
            quality: 90
        },
        pngquant:{
            quality: "65-90",
            speed: 4
        },
        svgo:{
            plugins: [
                { removeViewBox: false },
                { removeEmptyAttrs: false }
            ]
        }
    }
};