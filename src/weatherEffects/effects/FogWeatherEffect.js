import { AbstractWeatherEffect } from "./AbstractWeatherEffect.js";

export class FogWeatherEffect extends AbstractWeatherEffect {
  static get label() {
    return "Fog";
  }

  static get icon() {
    return "modules/fxmaster/assets/weatherEffects/icons/fog.png";
  }

  static get parameters() {
    return foundry.utils.mergeObject(super.parameters, {
      density: { min: 0.01, value: 0.08, max: 0.15, step: 0.01, decimals: 2 },
      "-=direction": undefined,
    });
  }

  getParticleEmitters() {
    return [this._getFogEmitter(this.parent)];
  }

  _getFogEmitter(parent) {
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

    // Animation
    const art = [
      "modules/fxmaster/assets/weatherEffects/effects/cloud1.png",
      "modules/fxmaster/assets/weatherEffects/effects/cloud2.png",
      "modules/fxmaster/assets/weatherEffects/effects/cloud3.png",
      "modules/fxmaster/assets/weatherEffects/effects/cloud4.png",
    ];
    const emitter = new PIXI.particles.Emitter(parent, art, config);
    return emitter;
  }

  /**
   * Configuration for the Fog particle effect
   * @type {Object}
   */
  static CONFIG = foundry.utils.mergeObject(
    SpecialEffect.DEFAULT_CONFIG,
    {
      alpha: {
        list: [
          { value: 0, time: 0 },
          { value: 0.1, time: 0.1 },
          { value: 0.3, time: 0.5 },
          { value: 0.1, time: 0.9 },
          { value: 0, time: 1 },
        ],
        isStepped: false,
      },
      scale: {
        start: 1.5,
        end: 1.0,
        minimumScaleMultiplier: 0.5,
      },
      speed: {
        start: 15,
        end: 10,
        minimumSpeedMultiplier: 0.2,
      },
      color: {
        list: [
          { value: "dddddd", time: 0 },
          { value: "dddddd", time: 1 },
        ],
      },
      startRotation: {
        min: 0,
        max: 360,
      },
      rotationSpeed: {
        min: 0.15,
        max: 0.35,
      },
      lifetime: {
        min: 10,
        max: 25,
      },
      blendMode: "normal",
      emitterLifetime: -1,
    },
    { inplace: false },
  );
}
