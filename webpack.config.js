const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/, // Handle .css files
        use: [
          'style-loader',  // Injects styles into DOM
          'css-loader',    // Resolves CSS imports
          'postcss-loader' // Processes CSS with PostCSS (for Tailwind)
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,  // New rule for image files
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'images', // Place images in 'images' folder inside 'dist'
            },
          },
        ],
      },
    ],
  },
  resolve: {
    fallback: {
      http: require.resolve('stream-http'),
      path: require.resolve('path-browserify'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      vm: require.resolve('vm-browserify'),
      fs: false,
      os: false,
      net: false,
      tls: false,
      util: require.resolve('util/'),
      url: require.resolve('url/'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    historyApiFallback: true, // Fallback to index.html for all routes
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
  },
  externals: {
    sqlite3: 'commonjs sqlite3', // Exclude SQLite3 from the web bundle
  },
};
