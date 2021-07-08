import { AbstractWeatherEffect } from "./AbstractWeatherEffect.js";

export class CrowsWeatherEffect extends AbstractWeatherEffect {
  static get label() {
    return "Crows";
  }

  static get icon() {
    return "modules/fxmaster/weatherEffects/icons/crows.png";
  }

  static get parameters() {
    return foundry.utils.mergeObject(super.parameters, {
      "-=direction": undefined
    });
  }

  static get effectOptions() {
    const options = super.effectOptions;
    options.density.min = 0.001;
    options.density.value = 0.006;
    options.density.max = 0.01;
    options.density.step = 0.001;
    return options;
  }

  getParticleEmitters() {
    return [this._getCrowsEmitter(this.parent)];
  }

  // This is where the magic happens
  _getCrowsEmitter(parent) {
    const d = canvas.dimensions;
    const p =
      (d.width / d.size) * (d.height / d.size) * this.options.density.value;
    const config = foundry.utils.mergeObject(
      this.constructor.CONFIG,
      {
        spawnRect: {
          x: d.paddingX,
          y: d.paddingY,
          w: d.sceneWidth,
          h: d.sceneHeight
        },
        maxParticles: p,
        frequency: this.constructor.CONFIG.lifetime.min / p
      },
      { inplace: false }
    );

    // Assets are selected randomly from the list for each particle
    const anim_sheet = {
      framerate: "15",
      textures: [
        {
          texture: "./modules/fxmaster/weatherEffects/effects/assets/raven1.png",
          count: 20
        },
        {
          texture: "./modules/fxmaster/weatherEffects/effects/assets/raven2.png",
          count: 3
        },
        {
          texture: "./modules/fxmaster/weatherEffects/effects/assets/raven3.png",
          count: 2
        },
        {
          texture: "./modules/fxmaster/weatherEffects/effects/assets/raven4.png",
          count: 2
        },
        {
          texture: "./modules/fxmaster/weatherEffects/effects/assets/raven3.png",
          count: 2
        },
        {
          texture: "./modules/fxmaster/weatherEffects/effects/assets/raven2.png",
          count: 3
        }
      ],
      loop: true
    };
    var emitter = new PIXI.particles.Emitter(parent, anim_sheet, config);
    emitter.particleConstructor = PIXI.particles.AnimatedParticle;
    return emitter;
  }

  // @override
  static get default() {
    const d = canvas.dimensions;
    const p = (d.width / d.size) * (d.height / d.size) * this.effectOptions.density.value;
    return {
      speed: 100,
      scale: 1,
      direction: 180,
      density: Math.round(100 * p) / 100,
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
          { value: 1, time: 0.02 },
          { value: 1, time: 0.98 },
          { value: 0, time: 1 }
        ],
        isStepped: false
      },
      scale: {
        list: [
          { value: 0.03, time: 0 },
          { value: 0.12, time: 0.1 },
          { value: 0.12, time: 0.9 },
          { value: 0.03, time: 1 }
        ],
        isStepped: false
      },
      speed: {
        start: 90,
        end: 100,
        minimumSpeedMultiplier: 0.6
      },
      acceleration: {
        x: 0,
        y: 0
      },
      startRotation: {
        min: 0,
        max: 360
      },
      rotation: 180,
      rotationSpeed: {
        min: 0,
        max: 0
      },
      lifetime: {
        min: 20,
        max: 40
      },
      blendMode: "normal",
      emitterLifetime: -1,
      orderedArt: true
    },
    { inplace: false }
  )
}