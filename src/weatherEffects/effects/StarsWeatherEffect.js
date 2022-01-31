import { AbstractWeatherEffect } from "./AbstractWeatherEffect.js";

export class StarsWeatherEffect extends AbstractWeatherEffect {
  static get label() {
    return "Stars";
  }

  static get icon() {
    return "modules/fxmaster/assets/weatherEffects/icons/stars.png";
  }

  static get parameters() {
    return foundry.utils.mergeObject(super.parameters, {
      density: { min: 0.05, value: 0.3, max: 1, step: 0.05, decimals: 2 },
      tint: { value: { value: "#bee8ee" } },
      "-=direction": undefined,
    });
  }

  getParticleEmitters() {
    return [this._getEmitter(this.parent)];
  }

  // This is where the magic happens
  _getEmitter(parent) {
    const d = canvas.dimensions;
    const p = (d.width / d.size) * (d.height / d.size) * this.options.density.value;
    const config = foundry.utils.mergeObject(
      this.constructor.CONFIG,
      {
        spawnRect: {
          x: d.sceneRect.x,
          y: d.sceneRect.y,
          w: d.sceneRect.width,
          h: d.sceneRect.height,
        },
        maxParticles: p,
        frequency: this.constructor.CONFIG.lifetime.min / p,
      },
      { inplace: false },
    );
    this.applyOptionsToConfig(config);

    // Assets are selected randomly from the list for each particle
    const art = [
      "modules/fxmaster/assets/weatherEffects/effects/star_01.png",
      "modules/fxmaster/assets/weatherEffects/effects/star_02.png",
      "modules/fxmaster/assets/weatherEffects/effects/star_04.png",
      "modules/fxmaster/assets/weatherEffects/effects/star_05.png",
      "modules/fxmaster/assets/weatherEffects/effects/star_06.png",
      "modules/fxmaster/assets/weatherEffects/effects/star_07.png",
      "modules/fxmaster/assets/weatherEffects/effects/star_08.png",
      "modules/fxmaster/assets/weatherEffects/effects/star_09.png",
    ];
    const emitter = new PIXI.particles.Emitter(parent, art, config);
    emitter.startColor = PIXI.particles.ParticleUtils.createSteppedGradient(config.color.list, true);
    return emitter;
  }

  /**
   * Configuration for the Stars particle effect
   * @type {Object}
   */
  static CONFIG = foundry.utils.mergeObject(
    SpecialEffect.DEFAULT_CONFIG,

    {
      alpha: {
        list: [
          { value: 0, time: 0 },
          { value: 0.9, time: 0.3 },
          { value: 0.9, time: 0.95 },
          { value: 0, time: 1 },
        ],
      },
      scale: {
        start: 0.05,
        end: 0.03,
        minimumScaleMultiplier: 0.85,
      },
      speed: {
        start: 5,
        end: 5,
        minimumSpeedMultiplier: 0.6,
      },
      color: {
        list: [
          { value: "bee8ee", time: 0 },
          { value: "d0e8ec", time: 1 },
        ],
      },
      startRotation: {
        min: 0,
        max: 360,
      },
      rotationSpeed: {
        min: 20,
        max: 50,
      },
      lifetime: {
        min: 8,
        max: 15,
      },
      blendMode: "screen",
      emitterLifetime: -1,
    },
    { inplace: false },
  );
}
