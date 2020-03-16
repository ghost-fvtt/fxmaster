export class FogWeatherEffect extends SpecialEffect {
  static get label() {
    return "Fog";
  }

  /* -------------------------------------------- */

  static get effectOptions() {
    const options = super.effectOptions;
    options.density.min = 0.02;
    options.density.value = 0.08;
    options.density.max = 0.15;
    options.density.step = 0.01;
    return options;
  }

  /* -------------------------------------------- */

  getParticleEmitters() {
    return [this._getFogEmitter(this.parent)];
  }

  /* -------------------------------------------- */

  _getFogEmitter(parent) {
    const d = canvas.dimensions;
    const p =
      (d.width / d.size) * (d.height / d.size) * this.options.density.value;
    const config = mergeObject(
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
    // Animation
    const art = [
      "/modules/fxmaster/effects/assets/cloud1.png",
      "/modules/fxmaster/effects/assets/cloud2.png",
      "/modules/fxmaster/effects/assets/cloud3.png",
      "/modules/fxmaster/effects/assets/cloud4.png"
    ];
    var emitter = new PIXI.particles.Emitter(parent, art, config);
    return emitter;
  }
}

FogWeatherEffect.CONFIG = mergeObject(
  SpecialEffect.DEFAULT_CONFIG,
  {
    alpha: {
      list: [
        { value: 0, time: 0 },
        { value: 0.1, time: 0.1 },
        { value: 0.3, time: 0.5 },
        { value: 0.1, time: 0.9 },
        { value: 0, time: 1 }
      ],
      isStepped: false
    },
    scale: {
      start: 1.5,
      end: 1.0,
      minimumScaleMultiplier: 0.5
    },
    speed: {
      start: 15,
      end: 10,
      minimumSpeedMultiplier: 0.2
    },
    color: {
      start: "dddddd",
      end: "dddddd"
    },
    startRotation: {
      min: 0,
      max: 360
    },
    rotation: {
      min: 0,
      max: 360
    },
    rotationSpeed: {
      min: 0.15,
      max: 0.35
    },
    acceleration: {
      x: 0,
      y: 0
    },
    lifetime: {
      min: 10,
      max: 25
    },
    blendMode: "normal",
    emitterLifetime: -1
  },
  { inplace: false }
);
