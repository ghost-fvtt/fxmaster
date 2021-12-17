import { AbstractWeatherEffect } from "./AbstractWeatherEffect.js";

export class RaintopWeatherEffect extends AbstractWeatherEffect {
  static get label() {
    return "Topdown Rain";
  }

  static get icon() {
    return "modules/fxmaster/assets/weatherEffects/icons/rain.png";
  }

  static get parameters() {
    return foundry.utils.mergeObject(super.parameters, {
      density: { min: 0.01, value: 0.3, max: 1, step: 0.01 },
      "-=direction": null,
    });
  }

  getParticleEmitters() {
    return [this._getEmitter(this.parent)];
  }

  _getEmitter(parent) {
    const d = canvas.dimensions;
    const p = (d.width / d.size) * (d.height / d.size) * this.options.density.value;
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
        maxParticles: p,
        frequency: 1 / p,
      },
      { inplace: false },
    );
    this.applyOptionsToConfig(config);

    const art = ["ui/particles/rain.png"];
    var emitter = new PIXI.particles.Emitter(parent, art, config);
    return emitter;
  }

  /**
   * Configuration for the Rain Top particle effect
   * @type {Object}
   */
  static CONFIG = foundry.utils.mergeObject(
    SpecialEffect.DEFAULT_CONFIG,

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
    { inplace: false },
  );
}
