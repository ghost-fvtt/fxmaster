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

/**
 * Wait for the given timeout.
 * @param {number} timeout The time to wait in milliseconds
 * @returns {Promise<void>} A promise that resolves after the given timeout
 */
export function wait(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

/**
 * Wait for a specific element to appear in the DOM.
 * @param {string} selector       The selector for the element to wait for
 * @param {number} [timeout=100]  The maximum time to wait in milliseconds
 * @returns {Promise<HTMLElement>} A promise that resolves to the element, if it is found
 */
export function waitForElement(selector, timeout = 100) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    wait(timeout).then(() =>
      reject(new Error(`Timeout while waiting for an element that matches the selector ${selector}`)),
    );
  });
}
