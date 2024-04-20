const Path = require("path");
const fs = require("fs");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// Function to generate HTML plugins dynamically
function generateHtmlPlugins(templateDir) {
	const templateFiles = fs.readdirSync(Path.resolve(__dirname, templateDir));
	return templateFiles
		.map((item) => {
			const parts = item.split(".");
			const name = parts[0];
			const extension = parts[1];
			if (extension === "html") {
				return new HtmlWebpackPlugin({
					filename: `${name}.html`,
					template: Path.resolve(
						__dirname,
						`${templateDir}/${name}.${extension}`
					),
					base: '/${name}/'
				});
			}
		})
		.filter((item) => item); // Filter undefined items
}

const htmlPlugins = generateHtmlPlugins("../src");

module.exports = {
	entry: {
		app: Path.resolve(__dirname, "../src/scripts/index.js"),
	},
	output: {
		path: Path.join(__dirname, "../build"),
		filename: "js/[name].js",
	},
	optimization: {
		splitChunks: {
			chunks: "all",
			name: false,
		},
	},
	resolve: {
		alias: {
			"~": Path.resolve(__dirname, "../src"),
		},
		modules: [Path.resolve(__dirname, "../node_modules"), "node_modules"],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [
				{ from: Path.resolve(__dirname, "../public"), to: "public" },
			],
		}),
		...htmlPlugins, // Spread all dynamically generated HtmlWebpackPlugin instances
	],
	module: {
		rules: [
			{
				test: /\.mjs$/,
				include: /node_modules/,
				type: "javascript/auto",
			},
			{
				test: /\.html$/i,
				loader: "html-loader",
			},
			{
				test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
				type: "asset",
			},
		],
	},
};
