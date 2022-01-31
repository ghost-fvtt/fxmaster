import copy from "@guanghechen/rollup-plugin-copy";
import sourcemaps from "rollup-plugin-sourcemaps";
import styles from "rollup-plugin-styles";
import { terser } from "rollup-plugin-terser";

import { distDirectory, name, sourceDirectory } from "./tools/const.mjs";

const staticFiles = [
  "assets",
  "CHANGELOG.md",
  "lang",
  "libs",
  "LICENSE.md",
  "module.json",
  "packs",
  "README.md",
  "templates",
];
const isProduction = process.env.NODE_ENV === "production";

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: { [`module/${name}`]: `${sourceDirectory}/module/${name}.js` },
  output: {
    dir: distDirectory,
    format: "es",
    sourcemap: true,
    assetFileNames: "[name].[ext]",
  },
  plugins: [
    sourcemaps(),
    styles({
      mode: ["extract", `css/${name}.css`],
      url: false,
      sourceMap: true,
      minimize: isProduction,
    }),
    copy({
      targets: [{ src: staticFiles.map((file) => `${sourceDirectory}/${file}`), dest: distDirectory }],
    }),
    isProduction && terser({ ecma: 2020, keep_fnames: true }),
  ],
};

export default config;
