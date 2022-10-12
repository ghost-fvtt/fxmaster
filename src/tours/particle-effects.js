export class ParticleEffectsTour extends Tour {
  constructor() {
    super({
      id: "particleEffects",
      title: "FXMASTER.TourParticleEffectsTitle",
      description: "FXMASTER.TourParticleEffectsDescription",
      canBeResumed: true,
      display: true,
      steps: [],
      suggestedNextTours: ["fxmaster.filterEffects"],
    });
  }
}
