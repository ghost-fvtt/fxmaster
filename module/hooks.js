export const registerHooks = function () {
    // ------------------------------------------------------------------
    // Hooks API
    Hooks.on("switchFilter", (params) => {
        //params.name
        // params.type
        // params.options
        filterManager.switch(params.name, params.type, null, params.options);
    });

    Hooks.on("switchWeather", (params) => {
        // params.name
        // params.type
        // params.options

        let newEffect = {};
        newEffect[params.name] = {
            type: params.type,
            options: params.options,
        };

        let flags = canvas.scene.getFlag("fxmaster", "effects");

        if (!flags) flags = {};
        let effects = {};

        if (hasProperty(flags, params.name)) {
            effects = flags;
            delete effects[params.name];
        } else {
            effects = mergeObject(flags, newEffect);
        }
        console.log(effects, flags);
        if (effects == {}) {
            console.log("WONT WORK");
            canvas.scene.unsetFlag("fxmaster", "effects");
        } else {
            canvas.scene.setFlag("fxmaster", "effects", diffObject(flags, effects));
        }
    });

    Hooks.on("updateWeather", (paramArr) => {
        let effects = {};
        for (let i = 0; i < paramArr.length; i++) {
            effects[randomID()] = paramArr[i];
        }
        canvas.scene.unsetFlag("fxmaster", "effects").then(() => {
            canvas.scene.setFlag("fxmaster", "effects", effects);
        });
    });
}