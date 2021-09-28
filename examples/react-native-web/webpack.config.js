const createWebpackConfig = require("react-webpack-bare");
const { merge } = require("webpack-merge");

// This is needed for webpack to import static images in JavaScript files.
const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: "url-loader",
    options: {
      name: "[name].[ext]",
      esModule: false,
    },
  },
};

module.exports = (env, argv) => {
  const webpackConfig = createWebpackConfig(
    argv.mode === "production" || env.production
  );
  return merge(webpackConfig, {
    module: {
      rules: [imageLoaderConfiguration],
    },
    resolve: {
      alias: {
        "react-native$": "react-native-web",
      },
    },
  });
};
