let path = require("path");
let BabelPlugin = require("rollup-plugin-babel");
let TerserPlugin = require("rollup-plugin-terser").terser;
let EslintPlugin = require("rollup-plugin-eslint").eslint;
let production = process.env.NODE_ENV === "production";
let plugins = [EslintPlugin({ fix: true }), BabelPlugin()];
let pathName = "";
if (production) {
	plugins.push(
		TerserPlugin({
			ecma: 8,
			compress: {
				ecma: 8,
				passes: 2
			},
			mangle: {
				//keep_classnames: true
				//keep_fnames:true
			},
			output: {
				ecma: 8
			}
		})
	);
	pathName = "build/prod";
} else {
	pathName = "build/dev";
}
module.exports = [
	{
		input: "./src/scripts/index.js",
		output: {
			file: path.resolve(__dirname, pathName, "bundle.js"),
			format: "iife",
			sourcemap: true
		},
		plugins
	},
	{
		input: "./src/scripts/worker.js",
		output: {
			file: path.resolve(__dirname, pathName, "worker.js"),
			format: "esm",
			sourcemap: true
		},
		plugins
	}
];
