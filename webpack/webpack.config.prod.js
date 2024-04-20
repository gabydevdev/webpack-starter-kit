const Webpack = require("webpack");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const common = require("./webpack.common.js");

module.exports = merge(common, {
	mode: "production",
	devtool: "source-map",
	stats: "errors-only",
	bail: true,
	output: {
		filename: "js/[name].[contenthash].js",
		chunkFilename: "js/[name].[contenthash].chunk.js",
	},
		new MiniCssExtractPlugin({
			filename: "css/[name].[chunkhash:8].css",
			chunkFilename: "css/[name].[chunkhash:8].chunk.js",
		}),
		new HtmlWebpackPlugin({
			template: Path.resolve(__dirname, '../src/index.html'),
			filename: 'index.html',
			base: '/'
		}),
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: "babel-loader",
			},
			{
				test: /\.s?css/i,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					"postcss-loader",
					"sass-loader",
				],
			},
		],
	},
});
