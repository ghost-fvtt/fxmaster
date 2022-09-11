import fs from "fs-extra";
import path from "node:path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { destinationDirectory, distDirectory, foundryconfigFile, packageId } from "./const.mjs";

/**
 * Get the data paths of Foundry VTT based on what is configured in the {@link foundryconfigFile}.
 */
function getDataPaths() {
  const config = fs.readJSONSync(foundryconfigFile);

  const dataPath = config?.dataPath;

  if (dataPath) {
    const dataPaths = Array.isArray(dataPath) ? dataPath : [dataPath];

    return dataPaths.map((dataPath) => {
      if (typeof dataPath !== "string") {
        throw new Error(
          `Property dataPath in foundryconfig.json is expected to be a string or an array of strings, but found ${dataPath}`,
        );
      }
      if (!fs.existsSync(path.resolve(dataPath))) {
        throw new Error(`The dataPath ${dataPath} does not exist on the file system`);
      }
      return path.resolve(dataPath);
    });
  } else {
    throw new Error(`No dataPath defined in ${foundryconfigFile}`);
  }
}
/**
 * Link the built package to the user data folders.
 * @param {boolean} clean Whether to remove the link instead of creating it
 */
async function linkPackage(clean) {
  if (!fs.existsSync(path.resolve("module.json"))) {
    throw new Error("Could not find module.json");
  }

  const linkDirectories = getDataPaths().map((dataPath) =>
    path.resolve(dataPath, "Data", destinationDirectory, packageId),
  );

  for (const linkDirectory of linkDirectories) {
    if (clean) {
      console.log(`Removing build in ${linkDirectory}.`);
      await fs.remove(linkDirectory);
    } else if (!fs.existsSync(linkDirectory)) {
      console.log(`Linking dist to ${linkDirectory}.`);
      await fs.ensureDir(path.resolve(linkDirectory, ".."));
      await fs.symlink(path.resolve(distDirectory), linkDirectory);
    } else {
      console.log(`Skipped linking to ${linkDirectory}, as it already exists.`);
    }
  }
}

const argv = yargs(hideBin(process.argv)).usage("Usage: $0").option("clean", {
  alias: "c",
  type: "boolean",
  default: false,
  description: "Remove the link instead of creating it",
}).argv;
const clean = argv.c;
await linkPackage(clean);
