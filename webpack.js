const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
const fs = require("fs-extra");
const kleur = require("kleur");
const defaultOptions = require("./default-config");

const log = (msg) =>
  console.log(`${kleur.bold("[react-webpack-bare]")} ${msg}`);

async function getBabelConfig() {
  const babelConfigFile = [
    ".babelrc",
    ".babelrc.json",
    ".babelrc.js",
    ".babelrc.mjs",
    ".babelrc.cjs",
    "babel.config.js",
    "babel.config.json",
    "babel.config.mjs",
    "babel.config.cjs",
  ];
  for (const file of babelConfigFile) {
    const babelConfigFilePath = path.resolve(process.cwd(), file);
    if (fs.existsSync(babelConfigFilePath)) {
      log(`Load babel config from ${babelConfigFilePath}`);
      return require(babelConfigFilePath);
    }
  }
  throw new Error("[react-webpack-bare] Cannot found babel config file");
}

const templatePathHtml = path.resolve(__dirname, "./templates/index.html");
const templatePathEntry = path.resolve(__dirname, "./templates/index.js");

/**
 *
 * @param {*} env
 * @param {typeof defaultOptions} options
 * @returns {import('webpack').Configuration}
 */
module.exports = async (isEnvProduction, configOptions = {}) => {
  const {
    shouldUseSourceMap,
    moduleFileExtensions,
    pathHtml,
    pathBuild,
    pathEntry,
    pathPublic,
  } = Object.assign(defaultOptions, configOptions);

  const babelOptions = await getBabelConfig();

  log(
    `Use ${
      isEnvProduction
        ? `${kleur.green("production")}`
        : `${kleur.yellow("development")}`
    } webpack configuration.
`
  );

  if (!fs.existsSync(pathHtml)) {
    log(`${pathHtml} is not found. Creating one.`);
    fs.copySync(templatePathHtml, pathHtml);
  }

  if (!fs.existsSync(pathEntry)) {
    log(`${pathEntry} is not found. Creating one.`);
    fs.copySync(templatePathEntry, pathEntry);
  }

  if (!isEnvProduction)
    babelOptions.plugins = [
      ...(babelOptions.plugins || []),
      require.resolve("react-refresh/babel"),
    ];

  return {
    devServer: {
      hot: true,
      static: { directory: pathPublic },
    },
    entry: pathEntry,
    mode: isEnvProduction ? "production" : "development",
    bail: isEnvProduction,
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? "source-map"
        : false
      : "cheap-module-source-map",
    output: {
      path: pathBuild,
      pathinfo: !isEnvProduction,
      filename: isEnvProduction
        ? "static/js/[name].[contenthash].js"
        : "static/js/bundle.js",
      chunkFilename: isEnvProduction
        ? "static/js/[name].[contenthash].chunk.js"
        : "static/js/[name].chunk.js",
    },
    resolve: {
      modules: [path.resolve("node_modules"), "node_modules"],
      extensions: moduleFileExtensions.map((ext) => `.${ext}`),
    },
    module: {
      rules: [
        // Handle node_modules packages that contain sourcemaps
        (shouldUseSourceMap || !isEnvProduction) && {
          enforce: "pre",
          exclude: /@babel(?:\/|\\{1,2})runtime/,
          test: /\.(js|mjs|jsx|ts|tsx|css)$/,
          use: "source-map-loader",
        },
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          include: path.resolve("./src"),
          exclude: /node_modules/,
          loader: "babel-loader",
          options: babelOptions,
        },
      ].filter(Boolean),
    },
    plugins: [
      isEnvProduction &&
        fs.readdirSync(pathPublic).length > 1 &&
        new CopyPlugin({
          patterns: [
            {
              from: pathPublic,
              to: pathBuild,
              filter: (resourcePath) => resourcePath !== pathHtml,
            },
          ],
        }),
      new HtmlWebpackPlugin({
        inject: true,
        template: pathHtml,
        ...(isEnvProduction && {
          minify: "auto",
        }),
      }),
      !isEnvProduction && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),
  };
};
