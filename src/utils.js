import { packageId } from "./constants.js";

/**
 * Reset a flag to a given value, replacing inner objects.
 * @param {foundry.abstract.Document} document The document on which to reset the flag
 * @param {string}                    key      The flag key
 * @param {*}                         value    The flag value
 * @return {Promise<Document>}  A Promise resolving to the updated document
 */
export function resetFlag(document, key, value) {
  if (typeof value === "object" && !Array.isArray(value) && value !== null) {
    const oldFlags = document.getFlag(packageId, key);
    const keys = oldFlags ? Object.keys(oldFlags) : [];
    keys.forEach((k) => {
      if (value[k]) return;
      value[`-=${k}`] = null;
    });
  }
  return document.setFlag(packageId, key, value);
}

/**
 * Round a number to the given number of decimals.
 * @param {number} number   The number to round
 * @param {number} decimals The number of decimals to round to
 * @returns {number} The rounded result
 */
export function roundToDecimals(number, decimals) {
  return Number(Math.round(number + "e" + decimals) + "e-" + decimals);
}
