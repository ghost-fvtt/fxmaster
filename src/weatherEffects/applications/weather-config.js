import "../../../css/weather-config.css";

import { packageId } from "../../constants.js";
import { FormApplicationWithCollapsibles } from "../../form-with-collapsibles.js";
import { resetFlags } from "../../utils.js";

export class WeatherConfig extends FormApplicationWithCollapsibles {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["form", "fxmaster", "weathers", "sidebar-popout"],
      closeOnSubmit: false,
      submitOnChange: false,
      submitOnClose: false,
      popOut: true,
      editable: game.user.isGM,
      width: 300,
      height: "auto",
      template: "modules/fxmaster/templates/weather-config.hbs",
      id: "effects-config",
      title: game.i18n.localize("FXMASTER.WeatherConfigTitle"),
    });
  }

  /** @override */
  getData() {
    const currentParticleEffects = canvas.scene?.getFlag(packageId, "effects") ?? {};

    const activeParticleEffects = Object.fromEntries(
      Object.values(currentParticleEffects).map((effect) => [effect.type, effect.options]),
    );

    /** @type {import("../weatherDB.js").WeatherDB} */
    const weather = CONFIG.fxmaster.weather;

    /** @type {Record<string, {label: string, expanded: boolean, effects: import("../weatherDB.js").WeatherDB}>}} */
    const initialWeatherEffectGroups = {};

    const weatherEffectGroups = Object.entries(weather)
      .sort(([, clsA], [, clsB]) => clsA.group.localeCompare(clsB.group) || clsA.label.localeCompare(clsB.label))
      .reduce((groups, [type, cls]) => {
        const group = cls.group;
        return {
          ...groups,
          [group]: {
            label: `FXMASTER.WeatherEffectsGroup${group.titleCase()}`,
            expanded: groups[group]?.expanded || Object.keys(activeParticleEffects).includes(type),
            effects: {
              ...groups[group]?.effects,
              [type]: cls,
            },
          },
        };
      }, initialWeatherEffectGroups);

    return {
      weatherEffectGroups: weatherEffectGroups,
      effects: weather,
      activeEffects: activeParticleEffects,
    };
  }

  /** @override */
  async _updateObject(_, formData) {
    /** @type {import("../weatherDB.js").WeatherDB} */
    const weathersDB = CONFIG.fxmaster.weather;
    const effects = Object.fromEntries(
      Object.entries(weathersDB)
        .filter(([, weatherCls]) => !!formData[weatherCls.label])
        .map(([weatherName, weatherCls]) => {
          const label = weatherCls.label;

          const options = Object.fromEntries(
            Object.entries(weatherCls.parameters).map(([key, parameter]) => {
              const optionValue =
                parameter.type === "color"
                  ? { apply: formData[`${label}_${key}_apply`], value: formData[`${label}_${key}`] }
                  : formData[`${label}_${key}`];

              return [key, optionValue];
            }),
          );

          const weather = {
            type: weatherName,
            options,
          };
          return [`core_${weatherName}`, weather];
        }),
    );
    resetFlags(canvas.scene, "effects", effects);
  }
}
