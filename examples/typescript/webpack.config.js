const createWebpackConfig = require("react-webpack-bare");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { merge } = require("webpack-merge");

module.exports = (env, argv) => {
  const webpackConfig = createWebpackConfig(
    argv.mode === "production" || env.production
  );
  return merge(webpackConfig, {
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
        },
      }),
    ],
  });
};
