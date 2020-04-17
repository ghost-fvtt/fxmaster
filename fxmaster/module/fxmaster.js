import { BubblesWeatherEffect } from "../effects/BubblesWeatherEffect.js";
import { CloudsWeatherEffect } from "../effects/CloudsWeatherEffect.js";
import { EmbersWeatherEffect } from "../effects/EmbersWeatherEffect.js";
import { CrowsWeatherEffect } from "../effects/CrowsWeatherEffect.js";
import { BatsWeatherEffect } from "../effects/BatsWeatherEffect.js";
import { FogWeatherEffect } from "../effects/FogWeatherEffect.js";
import { RaintopWeatherEffect } from "../effects/RaintopWeatherEffect.js";
import { FXColorFilter } from "../filters/FXColorFilter.js";
import { FXUnderwaterFilter } from "../filters/FXUnderwaterFilter.js";
import { FXMasterLayer } from "../effects/FXMasterLayer.js";
import { filterManager } from "../filters/FilterManager.js";

import { ExplosionEffect } from "../effects/ExplosionEffect.js";
import { FireballEffect } from "../effects/FireballEffect.js";
import { LightningEffect } from "../effects/LightningEffect.js";
import { NatureEffect } from "../effects/NatureEffect.js";

Hooks.once("init", function() {
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

  // Adding filters and effects
  if (!CONFIG.fxmaster) CONFIG.fxmaster = {};
  mergeObject(CONFIG.fxmaster, {
    filters: {
      underwater: FXUnderwaterFilter,
      color: FXColorFilter
    },
    effects: {
      explosion: ExplosionEffect,
      lightning: LightningEffect,
      fireball: FireballEffect,
      nature: NatureEffect
    }
  });
});

Hooks.once("canvasInit", canvas => {
  canvas.fxmaster = canvas.stage.addChildAt(new FXMasterLayer(canvas), 8);
});

Hooks.on("canvasInit", canvas => {
  filterManager.clear();
});

Hooks.on("canvasReady", _ => {
  filterManager.activate();
  canvas.fxmaster.updateMask();
  canvas.fxmaster.drawWeather();
});

Hooks.on("updateScene", (scene, data, options) => {
  if (!hasProperty(data, "flags.fxmaster.filters")) {
    canvas.fxmaster.updateMask();
    canvas.fxmaster.drawWeather();
  }
  filterManager.update();
});

// Template Effects
Hooks.on("renderMeasuredTemplateConfig", (data, html, object) => {
});

Hooks.on("updateMeasuredTemplate", (scene, html, update, data) => {
  // console.log(scene, html, update, data);
  let template = canvas.templates.placeables.find(t => t.id == update._id);
  console.log(template);
  let x = update.x ? update.x : template.x;
  let y = update.y ? update.y : template.y;
  canvas.fxmaster.throwEffect({position: {x: x, y: y}, shape: template.shape, radius: Math.max(template.width, template.height), type: "fireball"});
});

// ------------------------------------------------------------------
// Hooks API
Hooks.on("switchFilter", params => {
  //params.name
  // params.type
  // params.options
  filterManager.switch(params.name, params.type, null, params.options);
});

Hooks.on("switchWeather", params => {
  // params.name
  // params.type
  // params.options

  let newEffect = {};
  newEffect[params.name] = {
    type: params.type,
    options: params.options
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

  canvas.scene.setFlag("fxmaster", "effects", diffObject(flags, effects));
});

Hooks.on("updateWeather", paramArr => {
  let effects = {};
  for (let i = 0; i < paramArr.length; i++) {
    effects[randomID()] = paramArr[i]; 
  }
  canvas.scene.unsetFlag("fxmaster", "effects").then(() => {
    canvas.scene.setFlag("fxmaster", "effects", effects);
  });
})