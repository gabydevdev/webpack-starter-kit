const Path = require("path");
const fs = require("fs");
const glob = require("glob");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

function setupEntriesAndHtmlPlugins() {
	const htmlFiles = glob.sync(Path.resolve(__dirname, "../src/*.html"));
	const entries = {};
	const htmlPlugins = [];

	htmlFiles.forEach((file) => {
		const baseName = Path.basename(file, ".html");
		const jsFilePath = Path.resolve(__dirname, `../src/js/${baseName}.js`);

		if (fs.existsSync(jsFilePath)) {
			entries[baseName] = jsFilePath; // Add JS file to entry if it exists
		}

		htmlPlugins.push(
			new HtmlWebpackPlugin({
				template: file,
				filename: `${baseName}.html`,
				chunks: fs.existsSync(jsFilePath) ? [baseName] : [], // Include JS only if it exists
			})
		);
	});

	// Always include the main.js for shared functionality
	entries["main"] = Path.resolve(__dirname, "../src/js/main.js");

	return { entries, htmlPlugins };
}

const { entries, htmlPlugins } = setupEntriesAndHtmlPlugins();

module.exports = {
	entry: entries,
	output: {
		path: Path.join(__dirname, "../build"),
		filename: "js/[name].js",
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [
				{ from: Path.resolve(__dirname, "../public"), to: "public" },
			],
		}),
		...htmlPlugins
	],
	resolve: {
		alias: {
			"~": Path.resolve(__dirname, "../src"),
		},
		modules: [Path.resolve(__dirname, "../node_modules"), "node_modules"],
	},
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
