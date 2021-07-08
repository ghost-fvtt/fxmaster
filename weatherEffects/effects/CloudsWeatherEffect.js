import { AbstractWeatherEffect } from "./AbstractWeatherEffect.js";

export class CloudsWeatherEffect extends AbstractWeatherEffect {
  static get label() {
    return "Clouds";
  }

  static get icon() {
    return "modules/fxmaster/weatherEffects/icons/fog.png";
  }

  /* -------------------------------------------- */

  static get effectOptions() {
    const options = super.effectOptions;
    options.density.min = 0.2;
    options.density.value = 0.3;
    options.density.max = 0.6;
    options.density.step = 0.05;
    return options;
  }

  /* -------------------------------------------- */

  getParticleEmitters() {
    return [this._getCloudEmitter(this.parent)];
  }

  // @override
  setDirection(value) {
    this.options.direction = value;
    this.emitters[0].minStartRotation = value;
    this.emitters[0].maxStartRotation = value;
    const spawnRect = {
      ...this.emitters[0].spawnRect
    };

    // Need to change spawn rect so it spawns before the map
    const quadran = Math.round((value % 360) / 90);
    switch (quadran) {
      case 0:
        spawnRect.x -= 2 * spawnRect.width / 3;
        break;
      case 1:
        spawnRect.y -= 2 * spawnRect.height / 3;
        break;
      case 2:
        spawnRect.x += 2 * spawnRect.width / 3;
        break;
      case 3:
        spawnRect.y += 2 * spawnRect.height / 3;
        break;

    }
    this.emitters[0].spawnRect = spawnRect;
  }
  /* -------------------------------------------- */

  _getCloudEmitter(parent) {
    const d = canvas.dimensions;
    const config = foundry.utils.mergeObject(
      this.constructor.CONFIG,
      {
        spawnRect: {
          x: d.paddingX,
          y: d.paddingY,
          w: d.sceneWidth,
          h: d.sceneHeight
        }
      },
      { inplace: false }
    );
    // Animation
    const art = [
      "./modules/fxmaster/weatherEffects/effects/assets/cloud1.png",
      "./modules/fxmaster/weatherEffects/effects/assets/cloud2.png",
      "./modules/fxmaster/weatherEffects/effects/assets/cloud3.png",
      "./modules/fxmaster/weatherEffects/effects/assets/cloud4.png"
    ];
    var emitter = new PIXI.particles.Emitter(parent, art, config);
    return emitter;
  }

  // @override
  static get default() {
    return {
      speed: 100,
      scale: 1,
      direction: 90,
      density: 100,
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
          { value: 0.5, time: 0.05 },
          { value: 0.5, time: 0.95 },
          { value: 0, time: 1 }
        ],
        isStepped: false
      },
      scale: {
        start: 0.8,
        end: 0.8,
        minimumScaleMultiplier: 0.1
      },
      speed: {
        start: 100,
        end: 100,
        minimumSpeedMultiplier: 0.3
      },
      color: {
        start: "ffffff",
        end: "ffffff"
      },
      startRotation: {
        min: 80,
        max: 100
      },
      rotation: {
        min: 0,
        max: 360
      },
      acceleration: {
        x: 0,
        y: 0
      },
      lifetime: {
        min: 20,
        max: 120
      },
      frequency: 0.5,
      maxParticles: 100,
      blendMode: "normal",
      emitterLifetime: -1
    },
    { inplace: false }
  )
}