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

function parseSpecialEffects() {
  const effectData = game.settings.get('fxmaster', 'specialEffects');
  const specials = foundry.utils.deepClone(CONFIG.fxmaster.specials);
  effectData.reduce((acc, cur) => {
    if (!cur.folder) cur.folder = "Custom";
    const normalizedFolder = cur.folder.toLowerCase().replace(/ /g,'');
    if (!acc[normalizedFolder]) acc[normalizedFolder] = { label: cur.folder, effects: [] };
    acc[normalizedFolder].effects.push(cur);
    return acc;
  }, specials);
  Object.keys(specials).forEach((k) => {
    specials[k].effects.sort((a, b) => (''+a.label).localeCompare(b.label));
  })
  CONFIG.fxmaster.userSpecials = specials;
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

  CONST.USER_PERMISSIONS.EFFECT_CREATE = {
    label: "FXMASTER.PermissionCreate",
    hint: "FXMASTER.PermissionCreateHint",
    defaultRole: 2,
    disableGM: false
  };

  // Adding custom weather effects
  foundry.utils.mergeObject(CONFIG.weatherEffects, FXMASTER.weatherEffects);

  // Adding filters and effects
  if (!CONFIG.fxmaster) CONFIG.fxmaster = {};
  foundry.utils.mergeObject(CONFIG.fxmaster, { filters: FXMASTER.filters, specials: FXMASTER.specials });
});

Hooks.once("ready", () => {
  migrate();
});

Hooks.on("canvasInit", (canvas) => {
  if (!game.settings.get("fxmaster", "enable")) {
    return
  }
  parseSpecialEffects();
  filterManager.clear();
});

Hooks.on("canvasReady", (_) => {
  if (!game.settings.get("fxmaster", "enable")) {
    return
  }
  filterManager.activate();
  canvas.fxmaster.drawWeather();
  canvas.fxmaster.updateMask();
});

Hooks.on("updateScene", (scene, data, options) => {
  if (!game.settings.get("fxmaster", "enable")) {
    return
  }
  if (hasProperty(data, "flags.fxmaster")) {
    filterManager.update();
    canvas.fxmaster.drawWeather({ soft: true });
  }
  canvas.fxmaster.updateMask();
});

Hooks.on("updateDrawing", () => {
  canvas.fxmaster.updateMask();
})

Hooks.on("createDrawing", () => {
  canvas.fxmaster.updateMask();
})

Hooks.on("deleteDrawing", () => {
  canvas.fxmaster.updateMask();
})

Hooks.on("renderSidebarTab", async (object, html) => {
  if (object instanceof Settings) {
    const details = html.find("#game-details");
    const fxDetails = document.createElement("li");
    fxDetails.classList.add("donation-link");
    fxDetails.innerHTML = "FXMaster <a title='Donate' href='https://ko-fi.com/u_man'><img src='https://storage.ko-fi.com/cdn/cup-border.png'></a> <span><a href='https://gitlab.com/mesfoliesludiques/foundryvtt-fxmaster/-/boards/1546773'>Report issue</a></span>";
    details.append(fxDetails);
  }
})

Hooks.on("updateSetting", (data, value) => {
  if (data.data.key === "fxmaster.specialEffects") {
    parseSpecialEffects();
  }
})

Hooks.on("renderDrawingHUD", (hud, html, data) => {
  const maskToggle = document.createElement("div");
  maskToggle.classList.add("control-icon");
  if (data?.flags?.fxmaster?.masking) {
    maskToggle.classList.add("active");
  }
  maskToggle.dataset.action = "mask";
  maskToggle.innerHTML = "<i class='fas fa-mask'></i>";
  html.find(".col.left").append(maskToggle);

  html.find(".control-icon[data-action='mask']").click(async event => {
    await hud.object.document.setFlag("fxmaster", "masking", !data?.flags?.fxmaster?.masking);
    hud.render(true);
  })
});