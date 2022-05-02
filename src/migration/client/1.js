import { packageId } from "../../constants.js";

export async function migrate1() {
  const effects = game.settings.get(packageId, "specialEffects");
  for (let i = 0; i < effects.length; ++i) {
    if (typeof effects[i].scale !== "object") {
      effects[i].scale = {
        x: effects[i].scale,
        y: effects[i].scale,
      };
    }
  }
  await game.settings.set(packageId, "specialEffects", effects);
  return false;
}
