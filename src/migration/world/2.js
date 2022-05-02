import { packageId } from "../../constants.js";
import { resetFlag } from "../../utils.js";
import { migrate } from "../helpers.js";

export async function migrate2() {
  return migrate(migrationConfiguration2);
}

/** @type {import('../helpers.js').MigrationConfiguration} */
export const migrationConfiguration2 = {
  Scene: migrateScene,
};

async function migrateScene(scene) {
  const particleEffects = scene.getFlag(packageId, "effects") ?? {};
  if (Object.keys(particleEffects).length > 0) {
    const newParticleEffects = Object.fromEntries(
      Object.entries(particleEffects).map(([id, effect]) => {
        const particleEffectClass = CONFIG.fxmaster.particleEffects[effect.type];
        return [id, { ...effect, options: particleEffectClass.convertOptionsToV2(effect.options, scene) }];
      }),
    );
    await resetFlag(scene, "effects", newParticleEffects);
  }
}
