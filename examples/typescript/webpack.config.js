const createWebpackConfig = require("webpack-react-config");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { merge } = require("webpack-merge");

module.exports = async (env, argv) => {
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
