const loggingContext = "fxmaster";
const loggingSeparator = "|";

/**
 * Gets a logging function for the requested log level.
 * @typedef {'debug' | 'info' | 'warn' | 'error'} LogLevel
 * @typedef {(...args: unknown[]) => void} LoggingFunction
 * @param {LogLevel} [type = 'info'] - The log level of the requested logger
 * @returns {LoggingFunction}
 */
function getLoggingFunction(type = "info") {
  const log = console[type];
  return (...data) => log(loggingContext, loggingSeparator, ...data);
}

/**
 * A singleton logger object.
 */
export const logger = Object.freeze({
  debug: getLoggingFunction("debug"),
  info: getLoggingFunction("info"),
  warn: getLoggingFunction("warn"),
  error: getLoggingFunction("error"),
  getLoggingFunction,
});
