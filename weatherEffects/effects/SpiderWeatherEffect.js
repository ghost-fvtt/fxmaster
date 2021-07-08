import { AbstractWeatherEffect } from "./AbstractWeatherEffect.js";

export class SpiderWeatherEffect extends AbstractWeatherEffect {
  static get label() {
    return "Spider";
  }

  static get icon() {
    return "modules/fxmaster/weatherEffects/icons/spiders.png";
  }

  static get parameters() {
    return foundry.utils.mergeObject(super.parameters, {
      "-=direction": undefined
    });
  }

  static get effectOptions() {
    const options = super.effectOptions;
    options.density.min = 0.1;
    options.density.value = 0.3;
    options.density.max = 0.5;
    options.density.step = 0.1;
    return options;
  }

  // @override
  static get default() {
    const d = canvas.dimensions;
    const p = (d.width / d.size) * (d.height / d.size) * this.effectOptions.density.value;
    return {
      speed: 25,
      scale: 1,
      direction: 0,
      density: Math.round(1000 * p) / 1000,
      tint: "#FFFFFF"
    }
  }

  getParticleEmitters() {
    return [this._getSpidersEmitter(this.parent)];
  }

  // This is where the magic happens
  _getSpidersEmitter(parent) {
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
      framerate: "24",
      textures: [],
      loop: true
    };
    for (let i = 0; i < 25; i++) {
      anim_sheet.textures.push({
        count: 1,
        texture: `./modules/fxmaster/weatherEffects/effects/assets/Spider.${String(i).padStart(4, '0')}.png`
      })
    }
    var emitter = new PIXI.particles.Emitter(parent, anim_sheet, config);
    emitter.particleConstructor = PIXI.particles.AnimatedParticle;

    return emitter;
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
        ]
      },
      scale: {
        list: [
          { value: 0.05, time: 0 },
          { value: 0.08, time: 0.05 },
          { value: 0.08, time: 0.95 },
          { value: 0.05, time: 1 }
        ],
        minimumScaleMultiplier: 0.2
      },
      speed: {
        start: 15,
        end: 25,
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
      rotation: 0,
      rotationSpeed: {
        min: 0,
        max: 0
      },
      lifetime: {
        min: 5,
        max: 10
      },
      addAtBack: false,
      blendMode: "normal",
      emitterLifetime: -1,
      orderedArt: true
    },
    { inplace: false })
}