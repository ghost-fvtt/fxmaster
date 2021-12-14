import { AbstractWeatherEffect } from "./AbstractWeatherEffect.js";

export class EmbersWeatherEffect extends AbstractWeatherEffect {
  static get label() {
    return "Embers";
  }

  static get icon() {
    return "modules/fxmaster/assets/weatherEffects/icons/embers.png";
  }

  static get parameters() {
    return foundry.utils.mergeObject(super.parameters, {
      density: { min: 0.05, value: 0.7, max: 1.4, step: 0.05 },
      tint: { value: { value: "#f77300" } },
      "-=direction": undefined,
    });
  }

  getParticleEmitters() {
    return [this._getEmbersEmitter(this.parent)];
  }

  // This is where the magic happens
  _getEmbersEmitter(parent) {
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

    // Assets are selected randomly from the list for each particle
    const art = ["./modules/fxmaster/assets/weatherEffects/effects/ember.png"];
    var emitter = new PIXI.particles.Emitter(parent, art, config);
    emitter.startColor = PIXI.particles.ParticleUtils.createSteppedGradient(config.color.list, true);
    return emitter;
  }

  /**
   * Configuration for the Embers particle effect
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
        start: 0.15,
        end: 0.01,
        minimumScaleMultiplier: 0.85,
      },
      speed: {
        start: 40,
        end: 25,
        minimumSpeedMultiplier: 0.6,
      },
      color: {
        list: [
          { value: "f77300", time: 0 },
          { value: "f72100", time: 1 },
        ],
      },
      acceleration: {
        x: 1,
        y: 1,
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
        min: 4,
        max: 6,
      },
      blendMode: "screen",
      emitterLifetime: -1,
    },
    { inplace: false },
  );
}
