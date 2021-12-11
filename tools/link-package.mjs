import fs from "fs-extra";
import path from "node:path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { destinationDirectory, distDirectory, foundryconfigFile, name, sourceDirectory } from "./const.mjs";

/**
 * Get the data path of Foundry VTT based on what is configured in the {@link foundryconfigFile}.
 */
function getDataPath() {
  const config = fs.readJSONSync(foundryconfigFile);

  if (config?.dataPath) {
    if (!fs.existsSync(path.resolve(config.dataPath))) {
      throw new Error("User data path invalid, no Data directory found");
    }
    return path.resolve(config.dataPath);
  } else {
    throw new Error(`No user data path defined in ${foundryconfigFile}`);
  }
}
/**
 * Link the built package to the user data folder.
 * @param {boolean} clean Whether to remove the link instead of creating it
 */
async function linkPackage(clean) {
  if (!fs.existsSync(path.resolve(sourceDirectory, "module.json"))) {
    throw new Error("Could not find module.json");
  }

  const linkDirectory = path.resolve(getDataPath(), "Data", destinationDirectory, name);

  if (clean) {
    console.log(`Removing link to built package at ${linkDirectory}.`);
    await fs.remove(linkDirectory);
  } else if (!fs.existsSync(linkDirectory)) {
    console.log(`Linking built package to ${linkDirectory}.`);
    await fs.ensureDir(path.resolve(linkDirectory, ".."));
    await fs.symlink(path.resolve(".", distDirectory), linkDirectory);
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
