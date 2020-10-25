export class CloudsWeatherEffect extends SpecialEffect {
  static get label() {
    return "Clouds";
  }

  static get icon() {
    return "/modules/fxmaster/icons/weather/fog.png";
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

  /* -------------------------------------------- */

  _getCloudEmitter(parent) {
    const d = canvas.dimensions;
    const p =
      (d.width / d.size) * (d.height / d.size) * this.options.density.value;
    const config = mergeObject(
      this.constructor.CONFIG,
      {
        spawnRect: {
          x: d.paddingX,
          y: d.paddingY - 1024,
          w: d.sceneWidth,
          h: d.sceneHeight
        }
      },
      { inplace: false }
    );
    // Animation
    const art = [
      "./modules/fxmaster/effects/assets/cloud1.png",
      "./modules/fxmaster/effects/assets/cloud2.png",
      "./modules/fxmaster/effects/assets/cloud3.png",
      "./modules/fxmaster/effects/assets/cloud4.png"
    ];
    var emitter = new PIXI.particles.Emitter(parent, art, config);
    return emitter;
  }
}

CloudsWeatherEffect.CONFIG = mergeObject(
  SpecialEffect.DEFAULT_CONFIG,
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
);
