import { AbstractWeatherEffect } from "./AbstractWeatherEffect.js";

export class CloudsWeatherEffect extends AbstractWeatherEffect {
  static get label() {
    return "Clouds";
  }

  static get icon() {
    return "modules/fxmaster/assets/weatherEffects/icons/fog.png";
  }

  /** @override */
  static get parameters() {
    return foundry.utils.mergeObject(super.parameters, {
      "-=density": null,
    });
  }

  /** @override */
  getParticleEmitters() {
    return [this._getCloudEmitter(this.parent)];
  }

  /** @override */
  applyDirectionToConfig(config) {
    super.applyDirectionToConfig(config);

    const direction = this.options.direction?.value;
    if (direction !== undefined) {
      const spawnRect = { ...config.spawnRect };

      // Need to change spawn rect so it spawns before the map
      const quadran = Math.round((direction % 360) / 90);
      switch (quadran) {
        case 0:
          spawnRect.x -= (2 * spawnRect.w) / 3;
          break;
        case 1:
          spawnRect.y -= (2 * spawnRect.h) / 3;
          break;
        case 2:
          spawnRect.x += (2 * spawnRect.w) / 3;
          break;
        case 3:
          spawnRect.y += (2 * spawnRect.h) / 3;
          break;
      }
      config.spawnRect = spawnRect;
    }
  }

  _getCloudEmitter(parent) {
    const d = canvas.dimensions;
    const config = foundry.utils.mergeObject(
      this.constructor.CONFIG,
      {
        spawnRect: {
          x: d.sceneRect.x,
          y: d.sceneRect.y,
          w: d.sceneRect.width,
          h: d.sceneRect.height,
        },
      },
      { inplace: false },
    );
    this.applyOptionsToConfig(config);

    // Animation
    const art = [
      "./modules/fxmaster/assets/weatherEffects/effects/cloud1.png",
      "./modules/fxmaster/assets/weatherEffects/effects/cloud2.png",
      "./modules/fxmaster/assets/weatherEffects/effects/cloud3.png",
      "./modules/fxmaster/assets/weatherEffects/effects/cloud4.png",
    ];
    var emitter = new PIXI.particles.Emitter(parent, art, config);
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
      lifetime: {
        min: 20,
        max: 120,
      },
      frequency: 0.5,
      maxParticles: 100,
      blendMode: "normal",
      emitterLifetime: -1,
    },
    { inplace: false },
  );
}
