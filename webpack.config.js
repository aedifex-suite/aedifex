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
		extensions: ['.js', '.marko'],
//		aliasFields: ["browser"],
		alias: {
			schemata: path.resolve(__dirname, 'src/schemata/'),
			models: path.resolve(__dirname, 'src/models/'),
			views: path.resolve(__dirname, 'src/views/'),
			assets: path.resolve(__dirname, 'src/assets/'),
		}
	},
	module: {
		rules: [
			{
				test: /\.marko$/,
				use: 'marko-loader'
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
