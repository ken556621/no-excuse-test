const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/'
    },
    devServer: {
        contentBase: './dist',
        historyApiFallback: true
    },
   module: {
     rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['transform-class-properties']
            }
          }
        },
       {
         test: /\.s[ac]ss$/i,
         use: [
           'style-loader',
           'css-loader',
           'sass-loader',
         ],
       },
       {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
     ],
   },
  };