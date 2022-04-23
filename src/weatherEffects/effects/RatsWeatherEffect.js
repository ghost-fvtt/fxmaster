import { AbstractWeatherEffect } from "./AbstractWeatherEffect.js";

export class RatsWeatherEffect extends AbstractWeatherEffect {
  static get label() {
    return "Rats";
  }

  static get icon() {
    return "modules/fxmaster/assets/weatherEffects/icons/rats.png";
  }

  /** @override */
  static get group() {
    return "animals";
  }

  static get parameters() {
    return foundry.utils.mergeObject(super.parameters, {
      density: { min: 0.001, value: 0.006, max: 0.1, step: 0.001, decimals: 3 },
      "-=direction": undefined,
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

    const anim_sheet = {
      framerate: "10",
      textures: Array.fromRange(5).map(
        (index) => `modules/fxmaster/assets/weatherEffects/effects/rat/rat_${index}.png`,
      ),
      loop: true,
    };
    const emitter = new PIXI.particles.Emitter(parent, anim_sheet, config);
    emitter.particleConstructor = PIXI.particles.AnimatedParticle;
    return emitter;
  }

  /**
   * Configuration for the Rats particle effect
   * @type {Object}
   */
  static CONFIG = foundry.utils.mergeObject(
    SpecialEffect.DEFAULT_CONFIG,
    {
      alpha: {
        list: [
          { value: 0, time: 0 },
          { value: 1, time: 0.02 },
          { value: 1, time: 0.98 },
          { value: 0, time: 1 },
        ],
        isStepped: false,
      },
      scale: {
        list: [
          { value: 0.03, time: 0 },
          { value: 0.125, time: 0.1 },
          { value: 0.125, time: 0.9 },
          { value: 0.03, time: 1 },
        ],
        isStepped: false,
        minimumScaleMultiplier: 0.5,
      },
      speed: {
        start: 200,
        end: 200,
        minimumSpeedMultiplier: 0.6,
      },
      startRotation: {
        min: 0,
        max: 360,
      },
      lifetime: {
        min: 20,
        max: 40,
      },
      blendMode: "normal",
      emitterLifetime: -1,
    },
    { inplace: false },
  );
}
