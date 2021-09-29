# webpack-react-config

A bare Webpack config to create a react app without [create-react-app](https://github.com/facebook/create-react-app). Not battery included!

**Note:** This package is only for those who are experienced with Web development since it comes with **no configuration** out of the box. For better dx and production readiness, you may want to stick with [create-react-app](https://github.com/facebook/create-react-app) or use [Next.js](https://nextjs.org/).

## Features

- Bare minimal. You have the freedom to config CSS, images, svg, etc. yourself.
- Support both [babel](https://babeljs.io/) and [swc](https://swc.rs/). Allow custom config files.
- Public folder (`./public`)

## Installation

```bash
npm i --save-dev webpack-react-config webpack webpack-cli webpack-dev-server
```

## Usage

### package.json scripts

Add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "build": "webpack --mode=production",
    "dev": "webpack serve"
  }
}
```

### webpack.config.js

Create `webpack.config.js`:

```js
const createWebpackConfig = require("webpack-react-config");

module.exports = async (env, argv) => {
  const webpackConfig = await createWebpackConfig(
    argv.mode === "production" || env.production
  );
};
```

To extend `webpack-react-config`, we can use [webpack-merge](https://github.com/survivejs/webpack-merge) to merge additional configs into the return of `await createWebpackConfig()`.

```bash
npm i --save-dev webpack-merge
```

See [examples](examples) for some usages such add [_Adding TypeScript_](examples/typescript), [_Using react-native-web_](examples/react-native-web), and others.

Up next, depending on your preferences and requirements, you may want to either use [babel](https://babeljs.io/) or [swc](https://swc.rs/).

### With babel

[Example](./examples/simple)

Install dependencies:

```bash
npm i --save-dev @babel/core @babel/preset-env @babel/preset-react babel-loader
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

### With swc

[Example](./examples/swc)

Install dependencies:

```bash
npm i --save-dev @swc/core swc-loader
```

Create `.swcrc`:

```json
{
  "jsc": {
    "parser": {
      "syntax": "ecmascript",
      "jsx": true
    },
    "transform": {
      "react": {
        "runtime": "automatic"
      }
    }
  }
}
```

## Configurations

An options param can passed as the second argument to `createWebpackConfig`.

```js
createWebpackConfig(process.env.NODE_ENV === "production", options);
```

- `shouldUseSourceMap`: Whether to enable source map in production. Default: `true`.
- `moduleFileExtensions`: A list of module file extension to resolve. Default: `["web.mjs","mjs","web.js","js","web.ts","ts","web.tsx","tsx","json","web.jsx","jsx"]`.
- `pathEntry`: Path to entry file. Default: `./src/index.js`.
- `pathHtml`: Path to HTML file. Default: `./public/index.html`.
- `pathBuild`: Path to build output directory. Default: `./build`.
- `pathPublic`: Path to "public" folder (will be copied to build directory). Default: `./public`.
