Handlebars.registerHelper('eq', function (a, b) {
    return a == b;
});

class EffectsConfig extends FormApplication {
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.title = game.i18n.localize("EFFECTSMANAGE.Title");
        options.id = "effects-config";
        options.template = "modules/fxmaster/templates/effects-config.html";
        options.popOut = true;
        options.editable = game.user.isGM;
        options.width = 400;
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
            user: game.user,
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
            if (formData[CONFIG.weatherEffects[key].label]) {
                effects[randomID()] = { type: key, config: {} };
            }
        })
        canvas.scene.update({ "flags.fxmaster.effects": null }).then(_ => {
            canvas.scene.update({ "flags.fxmaster.effects": effects });
        });
    }
}

EffectsConfig.CONFIG_SETTING = "effectsConfiguration";
