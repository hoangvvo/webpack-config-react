const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
const fs = require("fs-extra");
const { merge } = require("webpack-merge");
const kleur = require("kleur");
const defaultOptions = require("./default-config");

const resolveModule = (id) => require.resolve(id);
const importModule = (id) => require(id);

const log = (msg) =>
  console.log(`${kleur.bold("[webpack-react-config]")} ${msg}`);

const error = (msg) => {
  console.error(`${kleur.bold("[webpack-react-config]")} ${msg}`);
  process.exit(1);
};

const isJSONFile = (filePath) => {
  const jsonExts = [".json", "rc"];
  for (const jsonExt of jsonExts) {
    if (filePath.endsWith(jsonExt)) return true;
  }
  return false;
};

const getConfig = (configFiles) => {
  for (const configFile of configFiles) {
    const configFilePath = path.resolve(process.cwd(), configFile);
    if (fs.existsSync(configFilePath)) {
      return [
        configFilePath,
        isJSONFile(configFilePath)
          ? JSON.parse(fs.readFileSync(configFilePath))
          : resolveModule(configFilePath),
      ];
    }
  }
};

const getBabelConfig = () => {
  const babelConfig = getConfig([
    ".babelrc",
    ".babelrc.json",
    ".babelrc.js",
    ".babelrc.mjs",
    ".babelrc.cjs",
    "babel.config.js",
    "babel.config.json",
    "babel.config.mjs",
    "babel.config.cjs",
  ]);
  if (babelConfig) {
    log(`Load babel config from ${babelConfig[0]}`);
    return babelConfig[1];
  }
};

const getSwcConfig = () => {
  const swcConfig = getConfig([".swcrc"]);
  if (swcConfig) {
    log(`Load swc config from ${swcConfig[0]}`);
    return swcConfig[1];
  }
};

const templatePathHtml = path.resolve(__dirname, "./templates/index.html");
const templatePathEntry = path.resolve(__dirname, "./templates/index.js");

/**
 *
 * @param {*} env
 * @param {typeof defaultOptions} options
 * @returns {import('webpack').Configuration}
 */
module.exports.createConfig = async (isEnvProduction, options) => {
  const {
    shouldUseSourceMap,
    moduleFileExtensions,
    pathHtml,
    pathBuild,
    pathEntry,
    pathPublic,
  } = Object.assign(defaultOptions, options);

  log(
    `Use ${
      isEnvProduction
        ? `${kleur.green("production")}`
        : `${kleur.yellow("development")}`
    } webpack configuration.`
  );

  let loader;

  let babelConfig = getBabelConfig();
  let swcConfig = !babelConfig ? getSwcConfig() : undefined;

  if (!babelConfig && !swcConfig) {
    error("Either babel or swc configuration file must be present");
  }

  if (babelConfig) {
    if (!isEnvProduction) {
      babelConfig = merge(babelConfig, {
        plugins: [resolveModule("react-refresh/babel")],
      });
    }
    loader = [resolveModule("babel-loader"), babelConfig];
  } else {
    if (!isEnvProduction) {
      swcConfig = merge(swcConfig, {
        jsc: {
          transform: {
            react: {
              development: !isEnvProduction,
              refresh: true,
            },
          },
        },
      });
    }
    loader = [resolveModule("swc-loader"), swcConfig];
  }

  if (!fs.existsSync(pathHtml)) {
    log(`${pathHtml} is not found. Creating one.`);
    fs.copySync(templatePathHtml, pathHtml);
  }

  if (!fs.existsSync(pathEntry)) {
    log(`${pathEntry} is not found. Creating one.`);
    fs.copySync(templatePathEntry, pathEntry);
  }

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
          loader: loader[0],
          options: loader[1],
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
