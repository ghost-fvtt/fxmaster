import { logger } from "./logger.js";
import { packageId } from "./constants.js";

const defaultMacroImg = "icons/svg/windmill.svg";

export async function saveParticleAndFilterEffectsAsMacro() {
  const particleEffectFlags = canvas.scene?.getFlag(packageId, "effects") ?? {};
  const particleEffects = Object.values(particleEffectFlags);

  const filterFlags = canvas.scene?.getFlag(packageId, "filters") ?? {};
  const filterEffects = Object.values(filterFlags);

  const { name, img } = getMacroNameAndImg(particleEffects, filterEffects);

  const commands = [];
  if (particleEffects.length > 0) {
    commands.push(`Hooks.call('${packageId}.updateParticleEffects', ${JSON.stringify(particleEffects)});`);
  }
  if (filterEffects.length > 0) {
    commands.push(`FXMASTER.filters.setFilters(${JSON.stringify(filterEffects)});`);
  }
  const command = commands.join("\n");

  await Macro.create({ type: "script", name, command, img });
  ui.notifications.info(`Macro '${name}' has been saved in the macro directory`);
}

function getMacroNameAndImg(particleEffects, filterEffects) {
  const particleEffectLabelsAndIcons = particleEffects.flatMap(({ type }) => {
    const particleEffectCls = CONFIG.fxmaster.particleEffects[type];
    if (!particleEffectCls) {
      logger.warn(`Encountered unknown particle effect type '${type}' during macro creation, skipping it.`);
      return [];
    }
    return [{ label: game.i18n.localize(particleEffectCls.label), icon: particleEffectCls.icon }];
  });
  const filterLabels = filterEffects.flatMap(({ type }) => {
    const filterEffectCls = CONFIG.fxmaster.filterEffects[type];
    if (!filterEffectCls) {
      logger.warn(`Encountered unknown filter effect type '${type}' during macro creation, skipping it.`);
      return [];
    }
    return [{ label: filterEffectCls.label }];
  });

  if (filterLabels.length === 0) {
    return particleEffectLabelsAndIcons.length === 1
      ? {
          name: `Particle Effect: ${particleEffectLabelsAndIcons[0].label}`,
          img: particleEffectLabelsAndIcons[0].icon,
        }
      : { name: "Particle Effects", img: defaultMacroImg };
  } else if (particleEffectLabelsAndIcons.length === 0) {
    return filterLabels.length === 1
      ? {
          name: `Filter Effect: ${filterLabels[0].label}`,
          img: defaultMacroImg,
        }
      : { name: "Filter Effects", img: defaultMacroImg };
  } else {
    return { name: `Particle & Filter Effects`, img: defaultMacroImg };
  }
}
