const path = require("path");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { ContextReplacementPlugin } = require('webpack');

module.exports = {
  mode: "production",
  devtool: 'source-map',
  context: __dirname,
  entry: {
    "kosher-zmanim": "./src/kosher-zmanim.ts",
    "kosher-zmanim.min": "./src/kosher-zmanim.ts",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "./dist"),
    libraryTarget: "umd",
    library: "KosherZmanim",
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              logInfoToStdOut: true,
              compilerOptions: {
                target: "es5",
                module: "es6",
              },
              configFile: "src/tsconfig.json",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  optimization: {
    minimizer: [new UglifyJsPlugin({
      sourceMap: true,
      include: /\.min\.js$/,
      uglifyOptions: {
        mangle: {
          keep_fnames: true,
        },
      },
    })],
  },
  plugins: [
    new ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
  ],
};

