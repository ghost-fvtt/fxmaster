import { packageId } from "./constants.js";

export const resetFlags = function (document, flaglabel, newFlags) {
  const oldFlags = document.getFlag(packageId, flaglabel);
  const keys = oldFlags ? Object.keys(oldFlags) : [];
  keys.forEach((k) => {
    if (newFlags[k]) return;
    newFlags[`-=${k}`] = null;
  });
  return document.setFlag(packageId, flaglabel, newFlags);
};

export function formatString(format, ...args) {
  return format.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != "undefined" ? args[number] : match;
  });
}

export function isV9OrLater() {
  return game.release?.generation ?? 0 >= 9;
}

export function roundToDecimals(number, decimals) {
  return Number(Math.round(number + "e" + decimals) + "e-" + decimals);
}

/**
 * Omit a specific key from an object.
 * @param {object} object The object from which to omit
 * @param {string|number|symbol} key The key to omit
 * @returns {object} The object without the given key.
 */
export function omit(object, key) {
  const { [key]: _omitted, ...rest } = object;
  return rest;
}
