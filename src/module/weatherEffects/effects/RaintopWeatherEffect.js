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
      density: { min: 0.01, value: 0.3, max: 1, step: 0.01, decimals: 2 },
      "-=direction": null,
    });
  }

  getParticleEmitters() {
    return [this._getEmitter(this.parent)];
  }

  _getEmitter(parent) {
    const d = canvas.dimensions;
    const p = (d.width / d.size) * (d.height / d.size) * this.options.density.value;
    const sceneRadius = Math.sqrt(d.sceneWidth * d.sceneWidth + d.sceneHeight * d.sceneHeight) / 2;
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
          x: d.sceneRect.x + d.sceneWidth / 2,
          y: d.sceneRect.y + d.sceneHeight / 2,
          r: sceneRadius * 1.3,
          minR: sceneRadius / 2,
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
      blendMode: "normal",
      emitterLifetime: -1,
    },
    { inplace: false },
  );
}
