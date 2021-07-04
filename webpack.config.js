const path = require('path')

module.exports = {
	target: 'electron-renderer',
	//mode: 'production',
	mode: 'development',
	entry: './src/renderer/index.js',
	output: {
		path: path.join(__dirname, 'build/'),
		// filename: 'build/js/bundle.js',
		filename: 'js/bundle.min.js'
	},
	resolve: {
		extensions: ['.js', '.mjs', '.marko'],
//		aliasFields: ["browser"],
		alias: {
			schemata: path.resolve(__dirname, 'src/schemata/'),
			models: path.resolve(__dirname, 'src/models/'),
			views: path.resolve(__dirname, 'src/views/'),
			assets: path.resolve(__dirname, 'src/assets/'),
			utils: path.resolve(__dirname, 'src/utils/'),
		}
	},
	module: {
		rules: [
			{
				test: /\.marko$/,
				loader: '@marko/webpack/loader',
				options: {
					babelConfig: {
						"presets": [
							"@babel/preset-env"
						],
						"plugins": [
							"@babel/plugin-proposal-optional-chaining",
							"@babel/plugin-transform-runtime",
						]
					}
				}
			},
			{
				test: /\.mjs$/,
				include: [
					path.resolve(__dirname, 'src/models')
				],
				use: {
					loader: 'babel-loader',
					options: {
						"presets": [
							"@babel/preset-env"
						],
						"plugins": [
							"@babel/plugin-proposal-private-methods",
							"@babel/plugin-proposal-optional-chaining",
							"@babel/plugin-transform-runtime",
						]
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
				]
			},
			{
				test: /\.node$/,
				use: 'node-loader'
			},
			{
				test: /\.ttf$/,
				use: 'file-loader'
			}
		]
	}
}
