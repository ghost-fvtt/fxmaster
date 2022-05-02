import { packageId } from "../../constants.js";
import { migrate } from "../helpers.js";

export async function migrate3() {
  return migrate(migrationConfiguration3);
}

/** @type {import('../helpers.js').MigrationConfiguration} */
export const migrationConfiguration3 = {
  Macro: migrateMacro,
  Scene: migrateScene,
};

async function migrateMacro(macro) {
  /** @type {{command: string, img: string | null}} */
  const { command, img } = macro;

  const newCommand = command
    ?.replaceAll(`updateWeather`, `${packageId}.updateParticleEffects`)
    .replaceAll(`${packageId}.updateWeather`, `${packageId}.updateParticleEffects`)
    .replaceAll(`switchWeather`, `${packageId}.switchParticleEffect`)
    .replaceAll(`${packageId}.switchWeather`, `${packageId}.switchParticleEffect`)
    .replaceAll("fxmaster/assets/specialEffects", "fxmaster/assets/special-effects")
    .replaceAll(
      "fxmaster/assets/special-effects/fxmaster/smokeBomb.webm",
      "fxmaster/assets/special-effects/fxmaster/smoke-bomb.webm",
    );

  const newImg = img?.replaceAll("fxmaster/assets/weatherEffects/icons", "fxmaster/assets/particle-effects/icons");

  if (newCommand !== command || newImg !== img) {
    await macro.update({ command: newCommand, img: newImg });
  }
}

async function migrateScene(scene) {
  if (scene.getFlag(packageId, "filteredLayers") !== undefined) {
    await scene.unsetFlag(packageId, "filteredLayers");
  }
}
