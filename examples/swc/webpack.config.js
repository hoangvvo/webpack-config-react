const createWebpackConfig = require("react-webpack-bare");

module.exports = async (env, argv) => {
  return createWebpackConfig(argv.mode === "production" || env.production);
};
