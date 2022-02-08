import { packageId } from "./constants.js";

const defaultMacroImg = "icons/svg/windmill.svg";

export async function saveWeatherAndFiltersAsMacro() {
  const weatherFlags = canvas.scene?.getFlag(packageId, "effects") ?? {};
  const weatherEffects = Object.values(weatherFlags);

  const filterFlags = canvas.scene?.getFlag(packageId, "filters") ?? {};
  const filterEffects = Object.values(filterFlags);

  const { name, img } = getMacroNameAndImg(weatherEffects, filterEffects);

  const commands = [];
  if (weatherEffects.length > 0) {
    commands.push(`Hooks.call('${packageId}.updateWeather', ${JSON.stringify(weatherEffects)});`);
  }
  if (filterEffects.length > 0) {
    commands.push(`FXMASTER.filters.setFilters(${JSON.stringify(filterEffects)});`);
  }
  const command = commands.join("\n");

  await Macro.create({ type: "script", name, command, img });
  ui.notifications.info(`Macro ${name} has been saved in the macro directory`);
}

function getMacroNameAndImg(weatherEffects, filterEffects) {
  const weatherLabelsAndIcons = weatherEffects.flatMap(({ type }) => {
    const weatherEffectCls = CONFIG.fxmaster.weather[type];
    if (!weatherEffectCls) {
      logger.warn(`Encountered unknown weather effect type '${type}' during macro creation, skipping it.`);
      return [];
    }
    return [{ label: weatherEffectCls.label, icon: weatherEffectCls.icon }];
  });
  const filterLabels = filterEffects.flatMap(({ type }) => {
    const filterEffectCls = CONFIG.fxmaster.filters[type];
    if (!filterEffectCls) {
      logger.warn(`Encountered unknown filter effect type '${type}' during macro creation, skipping it.`);
      return [];
    }
    return [{ label: filterEffectCls.label }];
  });

  if (filterLabels.length === 0) {
    return weatherLabelsAndIcons.length === 1
      ? {
          name: `Weather: ${weatherLabelsAndIcons[0].label}`,
          img: weatherLabelsAndIcons[0].icon,
        }
      : { name: "Weather", img: defaultMacroImg };
  } else if (weatherLabelsAndIcons.length === 0) {
    return filterLabels.length === 1
      ? {
          name: `Filter: ${filterLabels[0].label}`,
          img: defaultMacroImg,
        }
      : { name: "Filters", img: defaultMacroImg };
  } else {
    return { name: `Weather & Filters`, img: defaultMacroImg };
  }
}
