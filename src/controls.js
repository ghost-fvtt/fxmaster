import { packageId } from "./constants.js";
import { FilterManager } from "./filter-effects/filter-manager.js";
import { ParticleEffectsManagement } from "./particle-effects/applications/particle-effects-management.js";
import { SpecialEffectsManagement } from "./special-effects/applications/special-effects-management.js";
import { FilterEffectsManagementConfig } from "./filter-effects/applications/filter-effects-management.js";
import { saveParticleAndFilterEffectsAsMacro } from "./macro.js";

export function registerGetSceneControlButtonsHook() {
  Hooks.on("getSceneControlButtons", getSceneControlButtons);
}

function getSceneControlButtons(controls) {
  if (canvas == null) {
    return;
  }
  controls.push({
    name: "effects",
    title: "CONTROLS.Effects",
    icon: "fa-solid fa-wand-magic-sparkles",
    layer: "specials",
    visible: game.user.role >= game.settings.get(packageId, "permission-create"),
    tools: [
      {
        name: "special-effects",
        title: "CONTROLS.SpecialFX",
        icon: "fa-solid fa-hat-wizard",
        onClick: () => {
          new SpecialEffectsManagement().render(true);
        },
        button: true,
      },
      {
        name: "particle-effects",
        title: "CONTROLS.ParticleEffects",
        icon: "fa-solid fa-cloud-rain",
        onClick: () => {
          new ParticleEffectsManagement().render(true);
        },
        visible: game.user.isGM,
        button: true,
      },
      {
        name: "invert-mask",
        title: "CONTROLS.InvertMask",
        icon: "fa-solid fa-mask",
        onClick: () => {
          if (canvas.scene) {
            const invert = canvas.scene.getFlag(packageId, "invert") ?? false;
            canvas.scene.setFlag(packageId, "invert", !invert);
          }
        },
        visible: game.user.isGM,
        active: canvas.scene?.getFlag(packageId, "invert") ?? false,
        toggle: true,
      },
      {
        name: "filter-effects",
        title: "CONTROLS.Filters",
        icon: "fa-solid fa-filter",
        onClick: () => {
          new FilterEffectsManagementConfig().render(true);
        },
        visible: game.user.isGM,
        button: true,
      },
      {
        name: "save",
        title: "CONTROLS.SaveMacro",
        icon: "fa-solid fa-floppy-disk",
        onClick: saveParticleAndFilterEffectsAsMacro,
        visible: game.user.isGM,
        button: true,
      },
      {
        name: "clearfx",
        title: "CONTROLS.ClearFX",
        icon: "fa-solid fa-trash",
        onClick: () => {
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
    ],
    activeTool: "effect",
  });
}
