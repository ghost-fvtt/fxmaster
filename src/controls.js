import { packageId } from "./constants.js";
import { FilterManager } from "./filter-effects/filter-manager.js";
import { ParticleEffectsManagement } from "./particle-effects/applications/particle-effects-management.js";
import { SpecialEffectsManagement } from "./special-effects/applications/special-effects-management.js";
import { FilterEffectsManagementConfig } from "./filter-effects/applications/filter-effects-management.js";
import { saveParticleAndFilterEffectsAsMacro } from "./macro.js";

export function registerGetSceneControlButtonsHook() {
  Hooks.on("getSceneControlButtons", getSceneControlButtons);
}

function getSceneControlButtons(t) {
  if (!canvas) return;

  const onEvent = foundry.utils.isNewerVersion(game.version, "13.0.0") ? "onChange" : "onClick";

  const fxControl = {
    name: "effects",
    title: "CONTROLS.Effects",
    icon: "fas fa-wand-magic-sparkles",
    layer: "specials",
    [onEvent]: (_event, active) => {
      if (!active) return;
      canvas.layers.find((l) => l.options.name === "specials")?.activate();
    },
    visible: game.user.role >= game.settings.get(packageId, "permission-create"),
    order: 100,
    tools: {
      specials: {
        name: "specials",
        title: "CONTROLS.SpecialFX",
        icon: "fas fa-hat-wizard",
        order: 10,
        button: true,
        [onEvent]: (_event, active) => {
          if (!active) return;
          new SpecialEffectsManagement().render(true);
        },
        visible: true,
      },
      "particle-effects": {
        name: "particle-effects",
        title: "CONTROLS.ParticleEffects",
        icon: "fas fa-cloud-rain",
        order: 20,
        button: true,
        [onEvent]: (_event, _active) => new ParticleEffectsManagement().render(true),
        visible: game.user.isGM,
      },
      invertmask: {
        name: "invertmask",
        title: "CONTROLS.InvertMask",
        icon: "fas fa-mask",
        order: 30,
        toggle: true,
        active: canvas.scene?.getFlag(packageId, "invert") ?? false,
        [onEvent]: () => {
          const current = canvas.scene.getFlag(packageId, "invert") ?? false;
          canvas.scene.setFlag(packageId, "invert", !current);
        },
        visible: game.user.isGM,
      },
      filters: {
        name: "filters",
        title: "CONTROLS.Filters",
        icon: "fas fa-filter",
        order: 40,
        button: true,
        [onEvent]: () => new FilterEffectsManagementConfig().render(true),
        visible: game.user.isGM,
      },
      save: {
        name: "save",
        title: "CONTROLS.SaveMacro",
        icon: "fas fa-floppy-disk",
        order: 50,
        button: true,
        [onEvent]: () => saveParticleAndFilterEffectsAsMacro(),
        visible: game.user.isGM,
      },
      clearfx: {
        name: "clearfx",
        title: "CONTROLS.ClearFX",
        icon: "fas fa-trash",
        [onEvent]: () => {
          Dialog.confirm({
            title: game.i18n.localize("FXMASTER.ClearParticleAndFilterEffectsTitle"),
            content: game.i18n.localize("FXMASTER.ClearParticleAndFilterEffectsContent"),
            yes: () => {
              if (canvas.scene) {
                FilterManager.instance.removeAll();
                canvas.scene.unsetFlag(packageId, "effects");
              }
            },
            defaultYes: true,
          });
        },
        visible: game.user.isGM,
        button: true,
      },
    },
    activeTool: "specials",
  };

  if (foundry.utils.isNewerVersion(game.version, "13.0.0")) {
    t.effects = fxControl;
  } else {
    t.push(fxControl);
  }
}
