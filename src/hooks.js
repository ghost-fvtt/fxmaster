import { packageId } from "./constants.js";
import { format } from "./logger.js";
import { resetFlag } from "./utils.js";

export const registerHooks = function () {
  Hooks.on(`${packageId}.switchParticleEffect`, onSwitchParticleEffects);
  Hooks.on(`${packageId}.updateParticleEffects`, onUpdateParticleEffects);
  Object.keys(deprecations).forEach((hook) => Hooks.on(hook, onDeprecated(hook)));
};

/**
 * Handle a request to toggle named a particle effect in the current scene.
 * @param {{name: string, type: string, options: object}} parameters The parameters that define the named particle effect
 */
async function onSwitchParticleEffects(parameters) {
  if (!canvas.scene) {
    return;
  }
  const newEffect = { [parameters.name]: { type: parameters.type, options: parameters.options } };

  let flags = (await canvas.scene.getFlag(packageId, "effects")) ?? {};
  let effects = {};

  if (foundry.utils.hasProperty(flags, parameters.name)) {
    effects = flags;
    delete effects[parameters.name];
  } else {
    effects = foundry.utils.mergeObject(flags, newEffect);
  }
  if (Object.keys(effects).length == 0) {
    await canvas.scene.unsetFlag(packageId, "effects");
  } else {
    resetFlag(canvas.scene, "effects", effects);
  }
}

/**
 * Handle a request to set the particle effects in the current scene.
 * @param {Array<object>} parametersArray The array of parameters defining the effects to be activated
 */
async function onUpdateParticleEffects(parametersArray) {
  const effects = Object.fromEntries(parametersArray.map((parameters) => [foundry.utils.randomID(), parameters]));
  resetFlag(canvas.scene, "effects", effects);
}

const deprecations = {
  updateWeather: {
    replacedBy: `${packageId}.updateParticleEffects`,
    callback: onUpdateParticleEffects,
  },
  switchWeather: {
    replacedBy: `${packageId}.switchParticleEffects`,
    callback: onSwitchParticleEffects,
  },
  [`${packageId}.updateWeather`]: {
    replacedBy: `${packageId}.updateParticleEffects`,
    callback: onUpdateParticleEffects,
  },
  [`${packageId}.switchWeather`]: {
    replacedBy: `${packageId}.switchParticleEffects`,
    callback: onSwitchParticleEffects,
  },
};

function onDeprecated(hook) {
  return function (...args) {
    const deprecation = deprecations[hook];
    const msg = format(`The '${hook}' hook is deprecated in favor of the '${deprecation.replacedBy}' hook`);
    foundry.utils.logCompatibilityWarning(msg, {
      mod: foundry.CONST.COMPATIBILITY_MODES.WARNING,
      since: "FXMaster v3.0.0",
      until: "FXMaster v4.0.0",
      stack: false,
    });
    deprecation.callback(...args);
  };
}
