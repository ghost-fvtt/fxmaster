import { logger } from "./logger.js";
import { formatString, resetFlags } from "./utils.js";

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
  if (!canvas.scene) {
    return;
  }
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

const deprecationFormatString =
  "The '{0}' hook is deprecated and will be removed in a future version. Please use the " +
  "'fxmaster.{0}' hook instead. Be aware that the meaning of some options changed for the new hook. " +
  "Consult the documentation for more details: https://github.com/ghost-fvtt/fxmaster/blob/v2.0.0/README.md#weather-effect-options. " +
  "To get the same effect for this scene, the given parameters should look as follows for the new hook:";

async function onSwitchWeatherDeprecated(parameters) {
  const weatherEffectClass = CONFIG.fxmaster.weather[parameters.type];

  const v2Parameters = {
    ...parameters,
    options: weatherEffectClass.convertOptionsToV2(parameters.options, canvas.scene),
  };

  logger.warn(formatString(deprecationFormatString, "switchWeather"), v2Parameters);

  return onSwitchWeather(v2Parameters);
}

async function onUpdateWeatherDeprecated(parametersArray) {
  const v2ParametersArray = parametersArray.map((parameters) => {
    const weatherEffectClass = CONFIG.fxmaster.weather[parameters.type];
    return {
      ...parameters,
      options: weatherEffectClass.convertOptionsToV2(parameters.options, canvas.scene),
    };
  });

  logger.warn(formatString(deprecationFormatString, "updateWeather"), v2ParametersArray);

  return onUpdateWeather(v2ParametersArray);
}
