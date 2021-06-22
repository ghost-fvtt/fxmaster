import { filterManager } from "../filterEffects/FilterManager.js";
import { resetFlags } from "./utils.js";

export const registerHooks = function () {
    // ------------------------------------------------------------------
    // Hooks API

    Hooks.on("switchWeather", async (params) => {
        // params.name
        // params.type
        // params.options

        let newEffect = {};
        newEffect[params.name] = {
            type: params.type,
            options: params.options,
        };

        let flags = await canvas.scene.getFlag("fxmaster", "effects");
        if (!flags) flags = {};
        let effects = {};

        if (hasProperty(flags, params.name)) {
            effects = flags;
            delete effects[params.name];
        } else {
            effects = foundry.utils.mergeObject(flags, newEffect);
        }
        if (Object.entries(effects).length == 0) {
            await canvas.scene.unsetFlag("fxmaster", "effects");
        } else {
            resetFlags(canvas.scene, "effects", effects);
        }
    });

    Hooks.on("updateWeather", async (paramArr) => {
        const effects = {};
        for (let i = 0; i < paramArr.length; i++) {
            effects[randomID()] = paramArr[i];
        }
        resetFlags(canvas.scene, "effects", effects);
    });
}