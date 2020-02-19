Handlebars.registerHelper('eq', function (a, b) {
    return a == b;
});

Handlebars.registerHelper('isEffectActive', function (name) {
    let flags = canvas.scene.data.flags.fxmaster;
    if (flags && flags.effects) {
        let objKeys = Object.keys(flags.effects);
        for (let i = 0; i < objKeys.length; ++i) {
            let weather = CONFIG.weatherEffects[flags.effects[objKeys[i]].type];
            if (weather.label === name) {
                return true;
            }
        }
    }
    return false;
});

Handlebars.registerHelper('Config', function (key, name) {
    let flags = canvas.scene.data.flags.fxmaster;
    if (flags && flags.effects) {
        let objKeys = Object.keys(flags.effects);
        for (let i = 0; i < objKeys.length; ++i) {
            let weather = CONFIG.weatherEffects[flags.effects[objKeys[i]].type];
            if (weather.label === name) {
                return flags.effects[objKeys[i]].config[key];
            }
        }
    }
    return null;
});

class EffectsConfig extends FormApplication {
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.title = game.i18n.localize("WEATHERMANAGE.Title");
        options.id = "effects-config";
        options.template = "modules/fxmaster/templates/effects-config.html";
        options.popOut = true;
        options.editable = game.user.isGM;
        options.width = 300;
        options.height = 500;
        return options;
    }

    /* -------------------------------------------- */

    /**
     * Obtain module metadata and merge it with game settings which track current module visibility
     * @return {Object}   The data provided to the template when rendering the form
     */
    getData() {
        // Return data to the template
        return {
            effects: CONFIG.weatherEffects
        }
    }

    /* -------------------------------------------- */
    /*  Event Listeners and Handlers                */
    /* -------------------------------------------- */

    /**
     * This method is called upon form submission after form data is validated
     * @param event {Event}       The initial triggering submission event
     * @param formData {Object}   The object of validated form data with which to update the object
     * @private
     */
    _updateObject(_, formData) {
        let effects = {};
        Object.keys(CONFIG.weatherEffects).forEach(key => {
            let label = CONFIG.weatherEffects[key].label;
            if (formData[label]) {
                effects[randomID()] = {
                    type: key, config:
                    {
                        density: (formData[label + "_density"]),
                        speed: (formData[label + "_speed"]),
                        scale: (formData[label + "_scale"]),
                        tint: (formData[label + "_tint"]),
                        apply_tint: (formData[label + "_apply_tint"])
                    }
                };
            }
        })
        canvas.scene.setFlag("fxmaster", "effects", null).then(_ => {
            canvas.scene.setFlag("fxmaster", "effects", effects);
        });
    }
}

EffectsConfig.CONFIG_SETTING = "effectsConfiguration";
