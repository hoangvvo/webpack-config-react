const path = require("path");
const fs = require("fs");

const moduleFileExtensions = [
  "web.mjs",
  "mjs",
  "web.js",
  "js",
  "web.ts",
  "ts",
  "web.tsx",
  "tsx",
  "json",
  "web.jsx",
  "jsx",
];

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const resolveModule = (filePath) => {
  const extension = moduleFileExtensions.find((extension) =>
    fs.existsSync(resolveApp(`${filePath}.${extension}`))
  );
  if (extension) {
    return resolveApp(`${filePath}.${extension}`);
  }
  return resolveApp(`${filePath}.js`);
};

module.exports = {
  shouldUseSourceMap: true,
  moduleFileExtensions,
  pathHtml: resolveApp("./public/index.html"),
  pathBuild: resolveApp("build"),
  pathPublic: resolveApp("public"),
  pathEntry: resolveModule("./src/index"),
};
