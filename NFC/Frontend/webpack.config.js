const path = require("path");
const webpack = require("webpack");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: 'eval-source-map',
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
  },
  devServer: {
    port: 3000,
    historyApiFallback: true,
    host: 'nfc.local',
    server: {
      type: "https",
      options: {
        key: fs.readFileSync("/home/rowler/cert/key.pem"),
        cert: fs.readFileSync("/home/rowler/cert/cert.pem"),
      },
    },
    client: {
      webSocketURL: 'wss://nfc.local:3000/ws',
    }
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "public/favicon.ico" }, { from: "public/robots.txt" }],
    }),
    new HtmlWebpackPlugin({
      template: "public/index.html",
    }),
    new NodePolyfillPlugin(),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|gif|pdf|svg|jpeg|mp4)$/,
        type: "asset/resource",
      },
      {
        test: /\.html$/i,
        use: ["html-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer"),
      fs: false,
    },
  },
};
