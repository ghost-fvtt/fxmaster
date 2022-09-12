import { packageId } from "../constants.js";
import { FilterEffectsTour } from "./filter-effects.js";
import { OverviewTour } from "./overview.js";
import { ParticleEffectsTour } from "./particle-effects.js";
import { SpecialEffectsTour } from "./special-effects.js";

export function registerTours() {
  Hooks.once("setup", async () => {
    [OverviewTour, SpecialEffectsTour, ParticleEffectsTour, FilterEffectsTour].forEach((TourClass) => {
      const tour = new TourClass();
      game.tours.register(packageId, tour.id, tour);
    });
  });
}
