import { AbstractWeatherEffect } from "./AbstractWeatherEffect.js";

export class RaintopWeatherEffect extends AbstractWeatherEffect {
  static get label() {
    return "Topdown Rain";
  }

  static get icon() {
    return "modules/fxmaster/weatherEffects/icons/rain.png";
  }

  /* -------------------------------------------- */

  static get effectOptions() {
    const options = super.effectOptions;
    options.density.min = 0.3;
    options.density.value = 0.6;
    options.density.max = 0.8;
    options.density.step = 0.05;
    return options;
  }

  /* -------------------------------------------- */

  getParticleEmitters() {
    return [this._getEmitter(this.parent)];
  }

  /* -------------------------------------------- */

  _getEmitter(parent) {
    const d = canvas.dimensions;
    const p =
      (d.width / d.size) * (d.height / d.size) * this.options.density.value;
    const config = foundry.utils.mergeObject(
      this.constructor.CONFIG,
      {
        spawnType: "ring",
        lifetime: {
          min: 0.3,
          max: 0.7,
        },
        speed: {
          start: d.width / 3,
          end: d.height / 4,
          minimumSpeedMultiplier: 0.8,
        },
        spawnCircle: {
          x: d.paddingX + d.sceneWidth / 2,
          y: d.paddingY + d.sceneHeight / 2,
          r: d.width / 2,
          minR: d.width / 4,
        },
        maxParticles: 2 * p,
        frequency: 0.02,
      },
      { inplace: false }
    );
    const art = ["ui/particles/rain.png"];
    var emitter = new PIXI.particles.Emitter(parent, art, config);
    return emitter;
  }

  // @override
  static get default() {
    const d = canvas.dimensions;
    const p = (d.width / d.size) * (d.height / d.size) * this.effectOptions.density.value;
    return {
      speed: d.width / 3,
      scale: 1,
      direction: 180,
      density: Math.round(200 * p) / 100,
      tint: "#FFFFFF"
    }
  }

  /**
   * Configuration for the Bats particle effect
   * @type {Object}
   */
  static CONFIG = foundry.utils.mergeObject(SpecialEffect.DEFAULT_CONFIG,

    {
      alpha: {
        list: [
          { value: 0, time: 0 },
          { value: 0.6, time: 0.1 },
          { value: 0.23, time: 1 },
        ],
        isStepped: false,
      },
      scale: {
        start: 3,
        end: 0.4,
        minimumScaleMultiplier: 0.7,
      },
      color: {
        start: "dddddd",
        end: "dddddd",
      },
      startRotation: {
        min: 180,
        max: 180,
      },
      rotation: {
        min: 0,
        max: 0,
      },
      rotationSpeed: {
        min: 0,
        max: 0,
      },
      acceleration: {
        x: 0,
        y: 0,
      },
      blendMode: "normal",
      emitterLifetime: -1,
    },
    { inplace: false }
  )
}