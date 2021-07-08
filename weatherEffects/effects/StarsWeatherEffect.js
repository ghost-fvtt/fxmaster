import { AbstractWeatherEffect } from "./AbstractWeatherEffect.js";

export class StarsWeatherEffect extends AbstractWeatherEffect {
  static get label() {
    return "Stars";
  }

  static get icon() {
    return "modules/fxmaster/weatherEffects/icons/stars.png";
  }

  static get parameters() {
    return foundry.utils.mergeObject(super.parameters, {
      "-=direction": undefined
    });
  }

  static get effectOptions() {
    const options = super.effectOptions;
    options.density.min = 0.01;
    options.density.value = 0.3;
    options.density.max = 1;
    options.density.step = 0.05;
    return options;
  }

  getParticleEmitters() {
    return [this._getEmitter(this.parent)];
  }

  // This is where the magic happens
  _getEmitter(parent) {
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
    const art = [
      "./modules/fxmaster/weatherEffects/effects/assets/star_01.png",
      "./modules/fxmaster/weatherEffects/effects/assets/star_02.png",
      "./modules/fxmaster/weatherEffects/effects/assets/star_04.png",
      "./modules/fxmaster/weatherEffects/effects/assets/star_05.png",
      "./modules/fxmaster/weatherEffects/effects/assets/star_06.png",
      "./modules/fxmaster/weatherEffects/effects/assets/star_07.png",
      "./modules/fxmaster/weatherEffects/effects/assets/star_08.png",
      "./modules/fxmaster/weatherEffects/effects/assets/star_09.png",
    ];
    var emitter = new PIXI.particles.Emitter(parent, art, config);
    emitter.startColor = PIXI.particles.ParticleUtils.createSteppedGradient(
      config.color.list,
      true
    );
    return emitter;
  }


  // @override
  static get default() {
    const d = canvas.dimensions;
    const p = (d.width / d.size) * (d.height / d.size) * this.effectOptions.density.value;
    return {
      speed: 5,
      scale: 1,
      direction: 180,
      density: Math.round(100 * p) / 100,
      tint: "#bee8ee"
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
          { value: 0.9, time: 0.3 },
          { value: 0.9, time: 0.95 },
          { value: 0, time: 1 }
        ]
      },
      scale: {
        start: 0.05,
        end: 0.03,
        minimumScaleMultiplier: 0.85
      },
      speed: {
        start: 5,
        end: 0,
        minimumSpeedMultiplier: 0.6
      },
      color: {
        list: [
          { value: "bee8ee", time: 0 },
          { value: "d0e8ec", time: 1 }
        ],
        isStepped: false
      },
      acceleration: {
        x: 1,
        y: 1
      },
      startRotation: {
        min: 0,
        max: 360
      },
      rotation: 180,
      rotationSpeed: {
        min: 20,
        max: 50
      },
      lifetime: {
        min: 8,
        max: 15
      },
      blendMode: "screen",
      emitterLifetime: -1
    },
    { inplace: false }
  )
}