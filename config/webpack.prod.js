const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base');

const root = path.resolve(__dirname, '../');

module.exports = webpackMerge(baseConfig,{
	output:{
		path:path.resolve(root,'dist'),
		filename:'[name].[chunkhash:10].js',
	},
	module:{
		rules:[
			{
				test:/\.(css|less)$/,
				include:path.resolve(root,'src'),
				use:ExtractTextPlugin.extract({
					fallback:'style-loader',
					use:[{
						loader:'css-loader',
						options:{
							minimize:true,
						},
					},'postcss-loader','less-loader'],
				}),
			},
		],
	},
	devtool:'#source-map',
	plugin:[
		new UglifyJsPlugin({
			uglifyOptions:{
				compress:{
					warnings:false,
				},
			},
			sourceMap:true,
			parallel:true,
		}),
		new ExtractTextPlugin({
			filename:'bundle.[contenthash:10].css',
			allChunks:true,
		}),
	],
});