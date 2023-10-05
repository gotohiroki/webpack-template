const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const globule = require("globule");
const HtmlWebpackPlugin = require("html-webpack-plugin");

let rules = [
  {
    test: /\.(css|sass|scss)$/,
    use: [
      MiniCssExtractPlugin.loader,
      "css-loader",
      {
        loader: "postcss-loader",
        options: {
          postcssOptions: {
            plugins: [["autoprefixer"]],
          },
        },
      },
      "sass-loader",
    ],
  },
  {
    test: /\.(png|jpg|webp|svg)$/i,
    generator: {
      filename: "assets/images/[name].[contenthash][ext]",
    },
    type: "asset/resource",
  },
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    generator: {
      filename: "assets/fonts/[name].[contenthash][ext]",
    },
    type: "asset/resource",
  },
  {
    test: /\.(html)$/,
    use: {
      loader: "html-loader",
    },
  },
  {
    test: /\.pug$/,
    exclude: /node_modules/,
    use: [
      {
        loader: "pug-loader",
        options: {
          pretty: true,
          root: path.resolve(__dirname, "src", "pug", "page"),
        },
      },
    ],
  },
];

const buildDefault = {
  entry: "./src/assets/js/main.js",
  devtool: false,
  mode: "production",
  // mode:"development",
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
  },
  module: {
    rules: rules,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    roots: [path.resolve(__dirname, "src")],
  },
  // ファイルの出力設定
  output: {
    //  出力ファイルのディレクトリ名
    path: `${__dirname}/dist`,
    // 出力ファイル名
    filename: "assets/js/bundle.js", // パスを変更
  },
  plugins: [
    new MiniCssExtractPlugin({
      // 出力ファイル名
      filename: "assets/css/style.css", // パスを変更
    }),
    require("autoprefixer"),
  ],
  // node_modules を監視（watch）対象から除外
  watchOptions: {
    ignored: /node_modules/, //正規表現で指定
  },
};

if (process.env.es5) {
  rules.push({
    test: /\.m?js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env"],
      },
    },
  });
}
// pugファイルの複数ページ対応
const pugPaths = globule.find({
  src: ["src/pug/page/**/*.pug", "!src/pug/page/**/_*.pug"],
});
pugPaths.forEach(function (pugPath) {
  const filename = pugPath
    .replace("src/pug/page/", "")
    .replace(".pug", ".html");
  buildDefault.plugins.push(
    new HtmlWebpackPlugin({
      template: pugPath,
      filename,
      minify: true,
    })
  );
});

module.exports = buildDefault;
