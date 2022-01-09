import { AbstractWeatherEffect } from "./AbstractWeatherEffect.js";

export class BirdsWeatherEffect extends AbstractWeatherEffect {
  static get label() {
    return "Birds";
  }

  static get icon() {
    return "modules/fxmaster/assets/weatherEffects/icons/crows.png";
  }

  static get parameters() {
    return foundry.utils.mergeObject(super.parameters, {
      density: { min: 0.001, value: 0.006, max: 0.01, step: 0.001, decimals: 3 },
      "-=direction": undefined,
    });
  }

  getParticleEmitters() {
    return [this._getEmitter(this.parent)];
  }

  // This is where the magic happens
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

    // Assets are selected randomly from the list for each particle
    const anim_sheet = {
      framerate: "10",
      textures: [
        {
          texture: "./modules/fxmaster/assets/weatherEffects/effects/seagull_1.png",
          count: 2,
        },
        {
          texture: "./modules/fxmaster/assets/weatherEffects/effects/seagull_2.png",
          count: 7,
        },
        {
          texture: "./modules/fxmaster/assets/weatherEffects/effects/seagull_3.png",
          count: 2,
        },
        {
          texture: "./modules/fxmaster/assets/weatherEffects/effects/seagull_2.png",
          count: 2,
        },
      ],
      loop: true,
    };
    var emitter = new PIXI.particles.Emitter(parent, anim_sheet, config);
    emitter.particleConstructor = PIXI.particles.AnimatedParticle;
    return emitter;
  }

  /**
   * Configuration for the Birds particle effect
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
          { value: 0.3, time: 0 },
          { value: 0.7, time: 0.1 },
          { value: 0.7, time: 0.9 },
          { value: 0.3, time: 1 },
        ],
        isStepped: false,
      },
      speed: {
        start: 90,
        end: 100,
        minimumSpeedMultiplier: 0.6,
      },
      acceleration: {
        x: 0,
        y: 0,
      },
      startRotation: {
        min: 0,
        max: 360,
      },
      rotation: 180,
      rotationSpeed: {
        min: 0,
        max: 0,
      },
      lifetime: {
        min: 20,
        max: 40,
      },
      blendMode: "normal",
      emitterLifetime: -1,
      orderedArt: true,
    },
    { inplace: false },
  );
}
