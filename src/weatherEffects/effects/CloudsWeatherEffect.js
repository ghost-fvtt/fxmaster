import { AbstractWeatherEffect } from "./AbstractWeatherEffect.js";

export class CloudsWeatherEffect extends AbstractWeatherEffect {
  static get label() {
    return "Clouds";
  }

  static get icon() {
    return "modules/fxmaster/assets/weatherEffects/icons/fog.png";
  }

  /** @override */
  static get group() {
    return "weather";
  }

  /** @override */
  static get parameters() {
    return foundry.utils.mergeObject(super.parameters, {
      density: { min: 0.001, value: 0.03, max: 0.2, step: 0.001, decimals: 3 },
    });
  }

  /** @override */
  getParticleEmitters() {
    return [this._getCloudEmitter(this.parent)];
  }

  _getCloudEmitter(parent) {
    const d = canvas.dimensions;
    const p = (d.sceneRect.width / d.size) * (d.sceneRect.height / d.size) * this.options.density.value;

    const offsetFactor = 2 / 3;

    const diagonal = Math.sqrt(d.sceneRect.width * d.sceneRect.width + d.sceneRect.height * d.sceneRect.height);
    const maximumAverageSpeed = (this.constructor.CONFIG.speed.start + this.constructor.CONFIG.speed.end) / 2;
    const averageSpeed = (maximumAverageSpeed * (1 + this.constructor.CONFIG.speed.minimumSpeedMultiplier)) / 2;
    const averageDiagonalTime = diagonal / averageSpeed;
    const minLifetime = averageDiagonalTime / offsetFactor / 2;
    const maxLifetime = averageDiagonalTime / offsetFactor;

    const angle = Math.toRadians(this.options.direction.value);
    const directionVector = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    const config = foundry.utils.mergeObject(
      this.constructor.CONFIG,
      {
        spawnRect: {
          x: d.sceneRect.x - directionVector.x * d.sceneRect.width * offsetFactor,
          y: d.sceneRect.y - directionVector.y * d.sceneRect.height * offsetFactor,
          w: d.sceneRect.width,
          h: d.sceneRect.height,
        },
        maxParticles: p,
        frequency: (minLifetime + maxLifetime) / 2 / p,
        lifetime: {
          min: minLifetime,
          max: maxLifetime,
        },
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
   * Configuration for the Clouds particle effect
   * @type {Object}
   */
  static CONFIG = foundry.utils.mergeObject(
    SpecialEffect.DEFAULT_CONFIG,
    {
      alpha: {
        list: [
          { value: 0, time: 0 },
          { value: 0.5, time: 0.05 },
          { value: 0.5, time: 0.95 },
          { value: 0, time: 1 },
        ],
        isStepped: false,
      },
      scale: {
        start: 0.8,
        end: 0.8,
        minimumScaleMultiplier: 0.1,
      },
      speed: {
        start: 100,
        end: 100,
        minimumSpeedMultiplier: 0.3,
      },
      color: {
        list: [
          { value: "ffffff", time: 0 },
          { value: "ffffff", time: 1 },
        ],
      },
      startRotation: {
        min: 80,
        max: 100,
      },
      blendMode: "normal",
      emitterLifetime: -1,
    },
    { inplace: false },
  );
}
