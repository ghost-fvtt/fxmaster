import { AbstractWeatherEffect } from "./AbstractWeatherEffect.js";

export class SnowstormWeatherEffect extends AbstractWeatherEffect {
  static get label() {
    return "Snowstorm";
  }

  static get icon() {
    return "modules/fxmaster/assets/weatherEffects/icons/snow.png";
  }

  /** @override */
  static get parameters() {
    return foundry.utils.mergeObject(super.parameters, {
      density: { min: 0.05, value: 0.6, max: 1, step: 0.05, decimals: 2 },
    });
  }

  getParticleEmitters() {
    return [this._getSnowEmitter(this.parent)];
  }

  _getSnowEmitter(parent) {
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
        frequency: 1 / p,
      },
      { inplace: false },
    );
    this.applyOptionsToConfig(config);

    const art = [
      "./modules/fxmaster/assets/weatherEffects/effects/snow_01.png",
      "./modules/fxmaster/assets/weatherEffects/effects/snow_02.png",
    ];
    var emitter = new PIXI.particles.Emitter(parent, art, config);
    emitter.particleConstructor = PIXI.particles.PathParticle;
    return emitter;
  }

  /**
   * Configuration for the Snowstorm particle effect
   * @type {Object}
   */
  static CONFIG = foundry.utils.mergeObject(
    SpecialEffect.DEFAULT_CONFIG,
    {
      alpha: {
        start: 1.0,
        end: 1.0,
      },
      scale: {
        start: 0.2,
        end: 0.08,
        minimumScaleMultiplier: 0.8,
      },
      speed: {
        start: 400,
        end: 350,
        minimumSpeedMultiplier: 0.2,
      },
      startRotation: {
        min: 86,
        max: 94,
      },
      rotation: 0,
      rotationSpeed: {
        min: -60.0,
        max: 60.0,
      },
      lifetime: {
        min: 2.5,
        max: 6,
      },
      extraData: {
        path: "sin(x/150)*25",
      },
    },
    { inplace: false },
  );
}
