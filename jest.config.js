const path = require(`path`);
const glob = require(`glob`);

const pkgs = glob.sync(`./packages/*`).map(p => p.replace(/^\./, `<rootDir>`));

const distDirs = pkgs.map(p => path.join(p, `dist`));

module.exports = {
  notify: true,
  verbose: true,
  roots: pkgs,
  modulePathIgnorePatterns: distDirs,
  coveragePathIgnorePatterns: distDirs,
  testPathIgnorePatterns: [
    `/dist/`,
    `/node_modules/`
  ],
  moduleNameMapper: {
    "^highlight.js$": `<rootDir>/node_modules/highlight.js/lib/index.js`,
  },
};
