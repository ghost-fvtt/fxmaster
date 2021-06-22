export const registerHelpers = function () {
    Handlebars.registerHelper("isEffectActive", function (name) {
        let flags = canvas.scene.getFlag("fxmaster", "effects");
        if (flags) {
            let objKeys = Object.keys(flags);
            for (let i = 0; i < objKeys.length; ++i) {
                let weather = CONFIG.weatherEffects[flags[objKeys[i]].type];
                if (weather.label === name) {
                    return true;
                }
            }
        }
        return false;
    });

    Handlebars.registerHelper("Config", function (key, name) {
        let flags = canvas.scene.data.flags.fxmaster;
        if (flags?.effects) {
            let objKeys = Object.keys(flags.effects);
            for (let i = 0; i < objKeys.length; ++i) {
                let weather = CONFIG.weatherEffects[flags.effects[objKeys[i]].type];
                if (weather.label === name && flags.effects[objKeys[i]].options) {
                    return flags.effects[objKeys[i]].options[key];
                }
            }
        }
        if (key === "apply_tint") {
            return false
        }
        return 50;
    });
}