import { registerSettings } from "./settings.js";
import { registerHooks } from "./hooks.js";
import { FXMASTER } from "./config.js"
import { WeatherLayer } from "../weatherEffects/WeatherLayer.js";
import { filterManager } from "../filterEffects/FilterManager.js";
import { migrate } from './migration.js';
import { SpecialsLayer } from "../specialEffects/SpecialsLayer.js";
import { registerHelpers } from "./helpers.js"

window.FXMASTER = {
  filters: filterManager
};

function registerLayer() {
  CONFIG.Canvas.layers = foundry.utils.mergeObject(CONFIG.Canvas.layers, {
    fxmaster: WeatherLayer,
    specials: SpecialsLayer
  });
  // Overriding other modules if needed
  if (!Object.is(Canvas.layers, CONFIG.Canvas.layers)) {
    console.error('Possible incomplete layer injection by other module detected!...')

    const layers = Canvas.layers
    Object.defineProperty(Canvas, 'layers', {
      get: function () {
        return foundry.utils.mergeObject(layers, CONFIG.Canvas.layers)
      }
    })
  }
}

function parseSpecialEffects() {
  const effectData = game.settings.get('fxmaster', 'specialEffects');
  const specials = foundry.utils.deepClone(CONFIG.fxmaster.specials);
  effectData.reduce((acc, cur) => {
    if (!cur.folder) cur.folder = "Custom";
    const normalizedFolder = cur.folder.toLowerCase().replace(/ /g, '');
    if (!acc[normalizedFolder]) acc[normalizedFolder] = { label: cur.folder, effects: [] };
    acc[normalizedFolder].effects.push(cur);
    return acc;
  }, specials);
  Object.keys(specials).forEach((k) => {
    specials[k].effects.sort((a, b) => ('' + a.label).localeCompare(b.label));
  })
  CONFIG.fxmaster.userSpecials = specials;
}

Hooks.once("init", function () {
  // Register custom system settings
  registerSettings();
  registerHooks();
  registerLayer();
  registerHelpers();

  CONST.USER_PERMISSIONS.EFFECT_CREATE = {
    label: "FXMASTER.PermissionCreate",
    hint: "FXMASTER.PermissionCreateHint",
    defaultRole: 2,
    disableGM: false
  };

  // Adding filters, weathers and effects
  if (!CONFIG.fxmaster) CONFIG.fxmaster = {};
  foundry.utils.mergeObject(CONFIG.fxmaster, { filters: FXMASTER.filters, specials: FXMASTER.specials, weather: FXMASTER.weatherEffects });
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

Hooks.on("dropCanvasData", async (canvas, data) => {
  if (!(canvas.activeLayer instanceof SpecialsLayer)) return;
  if (data.type !== "SpecialEffect") return;

  await new Promise((resolve) => {
    const vid = document.createElement("video");
    vid.addEventListener("loadedmetadata", (e) => {
      data.width = vid.videoWidth * data.scale.x;
      data.height = vid.videoHeight * data.scale.y;
      resolve();
    }, false);
    vid.src = data.file;
  });

  const tileData = {
    alpha: 1,
    flags: {},
    height: data.height,
    hidden: false,
    img: data.file,
    locked: false,
    occlusion: { mode: 1, alpha: 0 },
    overHead: false,
    rotation: 0,
    tileSize: 100,
    video: { loop: true, autoplay: true, volume: 0 },
    width: data.width,
    x: data.x - data.anchor.x * data.width,
    y: data.y - data.anchor.y * data.height,
    z: 100
  };
  ui.notifications.info(`A new Tile was created for effect ${data.label}`);
  canvas.scene.createEmbeddedDocuments("Tile", [tileData]).then(() => {

  });
});

Hooks.on("hotbarDrop", (hotbar, data, slot) => {
  if (data.type !== "SpecialEffect") return;
  const macroCommand = SpecialsLayer._createMacro(data);
  data.type = "Macro";
  data.data = {
    command: macroCommand,
    name: data.label,
    type: "script",
    author: game.user.id
  }
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
  maskToggle.setAttribute("title", game.i18n.localize("FXMASTER.MaskWeather"));
  maskToggle.dataset.action = "mask";
  maskToggle.innerHTML = "<i class='fas fa-cloud'></i>";
  html.find(".col.left").append(maskToggle);

  html.find(".control-icon[data-action='mask']").click(async event => {
    await hud.object.document.setFlag("fxmaster", "masking", !data?.flags?.fxmaster?.masking);
    hud.render(true);
  })
});