import { resetFlags } from "./utils.js";

export const registerHooks = function () {
  // ------------------------------------------------------------------
  // Hooks API
  Hooks.on("fxmaster.switchWeather", onSwitchWeather);
  Hooks.on("fxmaster.updateWeather", onUpdateWeather);

  // deprecated hooks
  Hooks.on("switchWeather", onSwitchWeatherDeprecated);
  Hooks.on("updateWeather", onUpdateWeatherDeprecated);
};

/**
 * Handle a request to toggle named a weather effect in the current scene.
 * @param {{name: string, type: string, options: object}} parameters The parameters that define the named weather effect
 */
async function onSwitchWeather(parameters) {
  const newEffect = { [parameters.name]: { type: parameters.type, options: parameters.options } };

  let flags = (await canvas.scene.getFlag("fxmaster", "effects")) ?? {};
  let effects = {};

  if (foundry.utils.hasProperty(flags, parameters.name)) {
    effects = flags;
    delete effects[parameters.name];
  } else {
    effects = foundry.utils.mergeObject(flags, newEffect);
  }
  if (Object.keys(effects).length == 0) {
    await canvas.scene.unsetFlag("fxmaster", "effects");
  } else {
    resetFlags(canvas.scene, "effects", effects);
  }
}

/**
 * Handle a request to set the weather effects in the current scene.
 * @param {Array<object>} parametersArray The array of parameters defining the effects to be activated
 */
async function onUpdateWeather(parametersArray) {
  const effects = Object.fromEntries(parametersArray.map((parameters) => [foundry.utils.randomID(), parameters]));
  resetFlags(canvas.scene, "effects", effects);
}

async function onSwitchWeatherDeprecated(parameters) {
  console.warn(
    "The 'switchWeather' hook is deprecated and will be removed in a future version. Please use the 'fxmaster.switchWeather' hook instead.",
  );
  return onSwitchWeather(parameters);
}

async function onUpdateWeatherDeprecated(parametersArray) {
  console.warn(
    "The 'updateWeather' hook is deprecated and will be removed in a future version. Please use the 'fxmaster.updateWeather' hook instead.",
  );
  return onUpdateWeather(parametersArray);
}
