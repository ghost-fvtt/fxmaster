import { filterManager } from "../filters/FilterManager.js";
import { EffectsConfig } from "./config.js";
import { SpecialsConfig } from "./specials.js";
import { ColorizeConfig } from "./config.js";

Hooks.on("getSceneControlButtons", (controls) => {
  if (game.user.isGM) {
    controls.push({
      name: "effects",
      title: "CONTROLS.Effects",
      icon: "fas fa-magic",
      layer: "FXMasterLayer",
      tools: [
        {
          name: "weather",
          title: "CONTROLS.Weather",
          icon: "fas fa-cloud-rain",
          onClick: () => {
            new EffectsConfig().render(true);
          },
          button: true,
        },
        {
          name: "colorize",
          title: "CONTROLS.Colorize",
          icon: "fas fa-palette",
          onClick: () => {
            new ColorizeConfig().render(true);
          },
          button: true,
        },
        {
          name: "underwater",
          title: "CONTROLS.Underwater",
          icon: "fas fa-water",
          onClick: () => {
            filterManager.switch("core_underwater", "underwater", null, {});
          },
          button: true,
        },
        {
          name: "save",
          title: "CONTROLS.SaveMacro",
          icon: "fas fa-save",
          onClick: () => {
            let flags = canvas.scene.getFlag('fxmaster', 'effects');
            if (!flags) flags = {};
            let objs = Object.values(flags);
            let img = "icons/svg/windmill.svg";
            let name = "Weather";
            objs.forEach(effect => {
              console.log(effect);
              let icon = CONFIG.weatherEffects[effect.type].icon;
              if (icon) {
                img = icon;
              }
              name = CONFIG.weatherEffects[effect.type].label;
            })
            let effects = `Hooks.call('updateWeather', ${JSON.stringify(objs)});`;
            Macro.create({type: "script", name: name, command: effects, img: img});
            ui.notifications.info(`Macro ${name} has been saved in the macro directory`);
          },
          button: true,
        },
        {
          name: "specials",
          title: "CONTROLS.SpecialFX",
          icon: "fas fa-hat-wizard",
          onClick: () => {
            new SpecialsConfig().render(true);
          },
          button: true,
        },
        {
          name: "clearfx",
          title: "CONTROLS.ClearFX",
          icon: "fas fa-trash",
          onClick: () => {
            Dialog.confirm({
              title: game.i18n.localize("FXMASTER.Delete"),
              content: game.i18n.localize("FXMASTER.DeleteConfirm"),
              yes: () => {
                filterManager.removeAll();
                canvas.scene.unsetFlag("fxmaster", "effects");
              },
              defaultYes: true,
            });
          },
          button: true,
        },
      ],
    });
  }
});
