import { resetFlags } from "./utils.js";

export const registerHooks = function () {
  // ------------------------------------------------------------------
  // Hooks API

  Hooks.on("switchWeather", onSwitchWeather);
  Hooks.on("updateWeather", onUpdateWeather);
};

/**
 * Handle a request to toggle named a weather effect in the current scene.
 * @param {{name: string, type: string, options: object}} parameters The parameters that define the named weather effect
 */
async function onSwitchWeather(parameters) {
  let newEffect = {};
  newEffect[parameters.name] = {
    type: parameters.type,
    options: parameters.options,
  };

  let flags = await canvas.scene.getFlag("fxmaster", "effects");
  if (!flags) flags = {};
  let effects = {};

  if (hasProperty(flags, parameters.name)) {
    effects = flags;
    delete effects[parameters.name];
  } else {
    effects = foundry.utils.mergeObject(flags, newEffect);
  }
  if (Object.entries(effects).length == 0) {
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
