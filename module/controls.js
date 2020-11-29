import { filterManager } from "../filters/FilterManager.js";
import { WeatherConfig } from "./weather-config.js";
import { SpecialsConfig } from "./specials-config.js";
import { ColorizeConfig } from "./colorize-config.js";

Hooks.on("getSceneControlButtons", (controls) => {
  controls.push({
    name: "effects",
    title: "CONTROLS.Effects",
    icon: "fas fa-magic",
    layer: "FXMasterLayer",
    visible: game.user.can("DRAWING_CREATE") || game.user.isGM,
    tools: [
      {
        name: "specials",
        title: "CONTROLS.SpecialFX",
        icon: "fas fa-hat-wizard",
        onClick: () => {
          new SpecialsConfig().render(true);
        },
        button: true
      },
      {
        name: "weather",
        title: "CONTROLS.Weather",
        icon: "fas fa-cloud-rain",
        onClick: () => {
          new WeatherConfig().render(true);
        },
        visible: game.user.isGM,
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
            let icon = CONFIG.weatherEffects[effect.type].icon;
            if (icon) {
              img = icon;
            }
            name = CONFIG.weatherEffects[effect.type].label;
          })
          let effects = `Hooks.call('updateWeather', ${JSON.stringify(objs)});`;
          Macro.create({ type: "script", name: name, command: effects, img: img });
          ui.notifications.info(`Macro ${name} has been saved in the macro directory`);
        },
        visible: game.user.isGM,
        button: true,
      },
      {
        name: "colorize",
        title: "CONTROLS.Colorize",
        icon: "fas fa-palette",
        onClick: () => {
          new ColorizeConfig().render(true);
        },
        visible: game.user.isGM,
        button: true,
      },
      {
        name: "underwater",
        title: "CONTROLS.Underwater",
        icon: "fas fa-water",
        onClick: () => {
          filterManager.switch("core_underwater", "underwater", null, {});
        },
        visible: game.user.isGM,
        toggle: true,
      },
      {
        name: "predator",
        title: "CONTROLS.Predator",
        icon: "fas fa-wave-square",
        onClick: () => {
          filterManager.switch("core_predator", "predator", null, {});
        },
        visible: game.user.isGM,
        toggle: true,
      },
      {
        name: "oldfilm",
        title: "CONTROLS.OldFilm",
        icon: "fas fa-film",
        onClick: () => {
          filterManager.switch("core_oldfilm", "oldfilm", null, {});
        },
        visible: game.user.isGM,
        toggle: true,
      },
      {
        name: "bloom",
        title: "CONTROLS.Bloom",
        icon: "fas fa-ghost",
        onClick: () => {
          filterManager.switch("core_bloom", "bloom", null, {});
        },
        visible: game.user.isGM,
        toggle: true,
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
        visible: game.user.isGM,
        button: true,
      },
    ],
  });
});
