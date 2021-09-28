const createWebpackConfig = require("react-webpack-bare");

module.exports = (env, argv) => {
  return createWebpackConfig(argv.mode === "production" || env.production);
};