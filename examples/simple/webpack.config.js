const { createConfig } = require("webpack-react-config");

module.exports = async (env, argv) => {
  return createConfig(argv.mode === "production" || env.production);
};
