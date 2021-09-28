# react-webpack-bare

A bare Webpack config to create a react app without [create-react-app](https://github.com/facebook/create-react-app).

## Features

- Does not contain any resolvers. You have to config CSS, images, svg, etc. yourself.
- Allows custom [Babel config file](https://babeljs.io/docs/en/config-files).
- Public folder (`./public`)

## Installation

```bash
npm i --save-dev react-webpack-bare webpack webpack-cli webpack-dev-server @babel/core @babel/preset-env @babel/preset-react
```

## Usage

Add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "build": "webpack --mode=production",
    "dev": "webpack serve"
  }
}
```

Create `babel.config.json` (or [other formats](https://babeljs.io/docs/en/config-files#configuration-file-types))

```json
{
  "presets": [
    ["@babel/preset-env"],
    ["@babel/preset-react", { "runtime": "automatic" }]
  ]
}
```

Create `webpack.config.js`:

```js
const createWebpackConfig = require("react-webpack-bare");

module.exports = (env, argv) => {
  return createWebpackConfig(argv.mode === "production" || env.production);
};
```

To extend `react-native-bare`, we can use [webpack-merge](https://github.com/survivejs/webpack-merge) to merge additional configs into the return of `createWebpackConfig`.

```bash
npm i --save-dev webpack-merge
```

See [examples](examples) for some usages such add _Adding TypeScript_, _Using react-native-web_, and others.

## Configurations

An options param can passed as the second argument to `createWebpackConfig`.

```js
createWebpackConfig(true, options);
```

- `shouldUseSourceMap`: Whether to enable source map in production. Default: `true`.
- `moduleFileExtensions`: A list of module file extension to resolve. Default: `["web.mjs","mjs","web.js","js","web.ts","ts","web.tsx","tsx","json","web.jsx","jsx"]`.
- `pathEntry`: Path to entry file. Default: `./src/index.js`.
- `pathHtml`: Path to HTML file. Default: `./public/index.html`.
- `pathBuild`: Path to build output directory. Default: `./build`.
- `pathPublic`: Path to "public" folder (will be copied to build directory). Default: `./public`.
