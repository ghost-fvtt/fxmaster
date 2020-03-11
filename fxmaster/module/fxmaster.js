import {
    BubblesWeatherEffect
} from "../effects/BubblesWeatherEffect.js";
import {
    CloudsWeatherEffect
} from "../effects/CloudsWeatherEffect.js";
import {
    EmbersWeatherEffect
} from "../effects/EmbersWeatherEffect.js";
import {
    CrowsWeatherEffect
} from "../effects/CrowsWeatherEffect.js";
import {
    BatsWeatherEffect
} from "../effects/BatsWeatherEffect.js";
import {
    FogWeatherEffect
} from "../effects/FogWeatherEffect.js";
import {
    RaintopWeatherEffect
} from "../effects/RaintopWeatherEffect.js";
import {
    FXColorFilter
} from "../filters/FXColorFilter.js";
import {
    FXDizzyFilter
} from "../filters/FXDizzyFilter.js";
import {
    FXMasterLayer
} from "../effects/FXMasterLayer.js";
import {
    filterManager
} from "../filters/FilterManager.js";

Hooks.once("init", function () {
    // Adding custom weather effects
    mergeObject(CONFIG.weatherEffects, {
        bubbles: BubblesWeatherEffect,
        clouds: CloudsWeatherEffect,
        embers: EmbersWeatherEffect,
        crows: CrowsWeatherEffect,
        bats: BatsWeatherEffect,
        fog: FogWeatherEffect,
        raintop: RaintopWeatherEffect
    });

    // Adding filters
    if (!CONFIG.fxmaster) CONFIG.fxmaster = {};
    mergeObject(CONFIG.fxmaster, {
        filters: {
            dizzy: FXDizzyFilter,
            color: FXColorFilter
        }
    });
});

Hooks.once('canvasInit', (canvas) => {
    canvas.fxmaster = canvas.stage.addChildAt(new FXMasterLayer(canvas), 8);
});

Hooks.on('canvasInit', canvas => {
    filterManager.clear();
});

Hooks.on('canvasReady', (_) => {
    filterManager.activate();
    canvas.fxmaster.updateMask();
    canvas.fxmaster.drawWeather();
});

Hooks.on("updateScene", (scene, data, options) => {
    if (!hasProperty(data, 'flags.fxmaster.filters')) {
        canvas.fxmaster.updateMask();
        canvas.fxmaster.drawWeather();
    }
    filterManager.update();
});
