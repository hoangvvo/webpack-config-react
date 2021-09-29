const createWebpackConfig = require("webpack-react-config");

module.exports = async (env, argv) => {
  return createWebpackConfig(argv.mode === "production" || env.production);
};
