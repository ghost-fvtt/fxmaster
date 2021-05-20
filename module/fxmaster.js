import { registerSettings } from "./settings.js";
import { registerHooks } from "./hooks.js";
import { FXMASTER } from "./config.js"
import { FXMasterLayer } from "../effects/FXMasterLayer.js";
import { filterManager } from "../filters/FilterManager.js";
import { migrate } from './migration.js';

function registerLayer() {
  const layers = foundry.utils.mergeObject(Canvas.layers, {
    fxmaster: FXMasterLayer
  });
  Object.defineProperty(Canvas, 'layers', {
    get: function () {
      return layers
    }
  });
}

Hooks.once("init", function () {
  // Register custom system settings
  registerSettings();
  registerHooks();
  registerLayer();

  // Set missing icons
  CONFIG.weatherEffects.rain.icon = "modules/fxmaster/icons/weather/rain.png";
  CONFIG.weatherEffects.leaves.icon = "modules/fxmaster/icons/weather/leaves.png";
  CONFIG.weatherEffects.snow.icon = "modules/fxmaster/icons/weather/snow.png";

  // Adding custom weather effects
  foundry.utils.mergeObject(CONFIG.weatherEffects, FXMASTER.weatherEffects);

  // Adding filters and effects
  if (!CONFIG.fxmaster) CONFIG.fxmaster = {};
  foundry.utils.mergeObject(CONFIG.fxmaster, { filters: FXMASTER.filters, specials: FXMASTER.specials });
});

Hooks.once("setup", () => {
  migrate();
});

Hooks.on("canvasInit", (canvas) => {
  if (!game.settings.get("fxmaster", "enable")) {
    return
  }
  filterManager.clear();
});

Hooks.on("canvasReady", (_) => {
  if (!game.settings.get("fxmaster", "enable")) {
    return
  }
  filterManager.activate();
  canvas.fxmaster.updateMask();
  canvas.fxmaster.drawWeather();
});

Hooks.on("updateScene", (scene, data, options) => {
  if (!game.settings.get("fxmaster", "enable")) {
    return
  }
  if (hasProperty(data, "flags.fxmaster")) {
    filterManager.update();
    canvas.fxmaster.drawWeather();
  }
  canvas.fxmaster.updateMask();
});

Hooks.on("renderSidebarTab", async(object, html) => {
  if (object instanceof Settings) {
    const details = html.find("#game-details");
    const fxDetails = document.createElement("li");
    fxDetails.classList.add("donation-link");
    fxDetails.innerHTML = "FXMaster <a title='Donate' href='https://ko-fi.com/u_man'><img src='https://storage.ko-fi.com/cdn/cup-border.png'></a> <span><a href='https://gitlab.com/mesfoliesludiques/foundryvtt-fxmaster/-/boards/1546773'>Report issue</a></span>";
    details.append(fxDetails);
  }
})