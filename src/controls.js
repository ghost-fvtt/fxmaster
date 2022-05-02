import { packageId } from "./constants.js";
import { filterManager } from "./filter-effects/filter-manager.js";
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
    icon: "fas fa-wand-magic-sparkles",
    layer: "specials",
    visible: game.user.role >= game.settings.get(packageId, "permission-create"),
    tools: [
      {
        name: "specials",
        title: "CONTROLS.SpecialFX",
        icon: "fas fa-hat-wizard",
        onClick: () => {
          new SpecialEffectsManagement().render(true);
        },
        button: true,
      },
      {
        name: "particle-effects",
        title: "CONTROLS.ParticleEffects",
        icon: "fas fa-cloud-rain",
        onClick: () => {
          new ParticleEffectsManagement().render(true);
        },
        visible: game.user.isGM,
        button: true,
      },
      {
        name: "invertmask",
        title: "CONTROLS.InvertMask",
        icon: "fas fa-mask",
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
        name: "filters",
        title: "CONTROLS.Filters",
        icon: "fas fa-filter",
        onClick: () => {
          new FilterEffectsManagementConfig().render(true);
        },
        visible: game.user.isGM,
        button: true,
      },
      {
        name: "save",
        title: "CONTROLS.SaveMacro",
        icon: "fas fa-floppy-disk",
        onClick: saveParticleAndFilterEffectsAsMacro,
        visible: game.user.isGM,
        button: true,
      },
      {
        name: "clearfx",
        title: "CONTROLS.ClearFX",
        icon: "fas fa-trash",
        onClick: () => {
          Dialog.confirm({
            title: game.i18n.localize("FXMASTER.ClearParticleAndFilterEffectsTitle"),
            content: game.i18n.localize("FXMASTER.ClearParticleAndFilterEffectsContent"),
            yes: () => {
              if (canvas.scene) {
                filterManager.removeAll();
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
