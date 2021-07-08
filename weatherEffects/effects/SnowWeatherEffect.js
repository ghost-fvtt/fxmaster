import { AbstractWeatherEffect } from "./AbstractWeatherEffect.js";

/**
 * A special full-screen weather effect which uses one Emitters to render snowflakes
 * @type {SpecialEffect}
 */
export class SnowWeatherEffect extends AbstractWeatherEffect {
  static get label() {
    return "Snow";
  }

  static get icon() {
    return "modules/fxmaster/weatherEffects/icons/snow.png";
  }


  // @override
  static get default() {
    const d = canvas.dimensions;
    const p = (d.width / d.size) * (d.height / d.size) * this.effectOptions.density.value;
    return {
      speed: 210,
      scale: 1,
      direction: 63,
			density: Math.round(100 * p) / 100,
			tint: "#FFFFFF"
    }
  }

  /**
   * Configuration of the particle emitter for snowflakes
   * @type {object}
   */
  static CONFIG = foundry.utils.mergeObject(SpecialEffect.DEFAULT_CONFIG, {
    "alpha": {
      "start": 0.9,
      "end": 0.5
    },
    "scale": {
      "start": 0.2,
      "end": 0.4,
      "minimumScaleMultiplier": 0.5
    },
    "speed": {
      "start": 190,
      "end": 210,
      "minimumSpeedMultiplier": 0.6
    },
    "startRotation": {
      "min": 50,
      "max": 75
    },
    "rotation": 90,
    "rotationSpeed": {
      "min": 0,
      "max": 200
    },
    "lifetime": {
      "min": 4,
      "max": 4
    }
  }, { inplace: false });

  /* -------------------------------------------- */

  getParticleEmitters() {
    return [this._getSnowEmitter(this.parent)];
  }

  /* -------------------------------------------- */

  _getSnowEmitter(parent) {
    const d = canvas.dimensions;
    const p = (d.width / d.size) * (d.height / d.size) * this.options.density.value;
    const config = foundry.utils.mergeObject(this.constructor.CONFIG, {
      spawnRect: {
        x: 0,
        y: -0.10 * d.height,
        w: d.width,
        h: d.height
      },
      maxParticles: p,
      frequency: 1 / p
    }, { inplace: false });
    return new PIXI.particles.Emitter(parent, ["ui/particles/snow.png"], config);
  }
}
