import copy from "@guanghechen/rollup-plugin-copy";
import livereload from "rollup-plugin-livereload";
import sourcemaps from "rollup-plugin-sourcemaps";
import styles from "rollup-plugin-styles";
import { string } from "rollup-plugin-string";
import { terser } from "rollup-plugin-terser";

import { distDirectory, packageId, sourceDirectory } from "./tools/const.mjs";

const staticFiles = [
  "assets",
  "CHANGELOG.md",
  "lang",
  "libs",
  "LICENSE.md",
  "media",
  "module.json",
  "packs",
  "README.md",
  "templates",
];
const isProduction = process.env.NODE_ENV === "production";
const isWatch = process.env.ROLLUP_WATCH === "true";

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: { [`${packageId}`]: `${sourceDirectory}/${packageId}.js` },
  output: {
    dir: distDirectory,
    format: "es",
    sourcemap: true,
    assetFileNames: "[name].[ext]",
  },
  plugins: [
    sourcemaps(),
    styles({
      mode: ["extract", `css/${packageId}.css`],
      url: false,
      sourceMap: true,
      minimize: isProduction,
    }),
    string({
      include: [`${sourceDirectory}/**/*.frag`, `${sourceDirectory}/**/*.vert`],
    }),
    copy({
      verbose: true,
      targets: [{ src: staticFiles, dest: distDirectory }],
    }),
    isProduction && terser({ ecma: 2020, keep_fnames: true }),
    isWatch && livereload(distDirectory),
  ],
};

export default config;
