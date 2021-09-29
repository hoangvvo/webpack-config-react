const { createConfig } = require("webpack-react-config");
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

module.exports = async (env, argv) => {
  const webpackConfig = await createConfig(
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
