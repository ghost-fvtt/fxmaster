import { migrate } from "../helpers";

export async function migrate4() {
  return migrate(migrationConfiguration4);
}

/** @type {import('../helpers').MigrationConfiguration} */
export const migrationConfiguration4 = {
  Scene: migrateScene,
};

async function migrateScene(scene) {
  const originalWeatherEffectKeys = Object.keys(CONFIG.originalWeatherEffects);
  const weatherEffectsToMigrate = Object.keys(CONFIG.fxmaster.particleEffects).filter(
    (effect) => !originalWeatherEffectKeys.includes(effect), // only migrate effects where we are certain they are ours
  );

  if (weatherEffectsToMigrate.includes(scene.weather)) {
    await scene.update({ weather: `fxmaster.${scene.weather}` });
  }
}
