import { AbstractWeatherEffect } from "./AbstractWeatherEffect.js";

export class BubblesWeatherEffect extends AbstractWeatherEffect {
  static get label() {
    return "Bubbles";
  }

  static get icon() {
    return "modules/fxmaster/assets/weatherEffects/icons/bubbles.png";
  }

  static get parameters() {
    return foundry.utils.mergeObject(super.parameters, {
      density: { min: 0.03, value: 0.15, max: 0.4, step: 0.01 },
      "-=direction": undefined,
    });
  }

  getParticleEmitters() {
    return [this._getBubbleEmitter(this.parent)];
  }

  _getBubbleEmitter(parent) {
    const d = canvas.dimensions;
    const p = (d.width / d.size) * (d.height / d.size) * this.options.density.value;
    const config = foundry.utils.mergeObject(
      this.constructor.CONFIG,
      {
        spawnRect: {
          x: d.paddingX,
          y: d.paddingY,
          w: d.sceneWidth,
          h: d.sceneHeight,
        },
        maxParticles: p,
        frequency: this.constructor.CONFIG.lifetime.min / p,
      },
      { inplace: false },
    );
    this.applyOptionsToConfig(config);

    const art = ["./modules/fxmaster/assets/weatherEffects/effects/bubbles.png"];
    var emitter = new PIXI.particles.Emitter(parent, art, config);
    return emitter;
  }

  /**
   * Configuration for the Bubbles particle effect
   * @type {Object}
   */
  static CONFIG = foundry.utils.mergeObject(
    SpecialEffect.DEFAULT_CONFIG,
    {
      alpha: {
        list: [
          { value: 0, time: 0 },
          { value: 0.85, time: 0.05 },
          { value: 0.85, time: 0.98 },
          { value: 0, time: 1 },
        ],
      },
      scale: {
        start: 0.25,
        end: 0.5,
        minimumScaleMultiplier: 0.5,
      },
      speed: {
        start: 20,
        end: 60,
        minimumSpeedMultiplier: 0.6,
      },
      color: {
        list: [
          { value: "ffffff", time: 0 },
          { value: "ffffff", time: 1 },
        ],
      },
      startRotation: {
        min: 0,
        max: 360,
      },
      rotation: 180,
      rotationSpeed: {
        min: 100,
        max: 200,
      },
      lifetime: {
        min: 8,
        max: 10,
      },
      blendMode: "normal",
      emitterLifetime: -1,
    },
    { inplace: false },
  );
}
