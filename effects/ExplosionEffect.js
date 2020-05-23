export class ExplosionEffect extends SpecialEffect {
  constructor(parent) {
    super(parent);

    this._x = 0;
    this._y = 0;
  }

  static get label() {
    return "Smokebomb";
  }

  static get icon() {
    return "/modules/fxmaster/icons/bomb.png";
  }

  /* -------------------------------------------- */

  static get effectOptions() {
    const options = super.effectOptions;
    options.density.min = 0.03;
    options.density.value = 0.15;
    options.density.max = 0.4;
    options.density.step = 0.01;
    return options;
  }

  get xOrigin() {
    return this.emitters[0].spawnCircle.x;
  }

  get yOrigin() {
    return this.emitters[0].spawnCircle.y;
  }

  set xOrigin(coords) {
    this.emitters[0].spawnCircle.x = coords;
  }

  set yOrigin(coords) {
    this.emitters[0].spawnCircle.y = coords;
  }

  /* -------------------------------------------- */

  getParticleEmitters() {
    return [this._getEmitter(this.parent)];
  }

  /* -------------------------------------------- */

  _getEmitter(parent) {
    const d = canvas.dimensions;
    const p =
      (d.width / d.size) * (d.height / d.size) * this.options.density.value;

    const config = mergeObject(
      this.constructor.CONFIG,
      {
        spawnType: "ring",
        spawnCircle: {
          x: d.width / 2,
          y: d.height / 2,
          r: 40,
          minR: 39
        },
        maxParticles: p,
        frequency: this.constructor.CONFIG.lifetime.min / p
      },
      {
        inplace: false
      }
    );
    let gridSize = canvas.scene.data.grid;
    if (gridSize) {
      config.spawnCircle.r = 4 * canvas.scene.data.grid;
      config.scale.start *= gridSize / 64;
      config.scale.end *= gridSize / 64;
    }
    const art = ["/modules/fxmaster/effects/assets/smoke.png"];
    var emitter = new PIXI.particles.Emitter(parent, art, config);
    return emitter;
  }
}

ExplosionEffect.CONFIG = mergeObject(
  SpecialEffect.DEFAULT_CONFIG,
  {
    alpha: {
      list: [
        { value: 0, time: 0 },
        { value: 0.15, time: 0.1 },
        { value: 0.15, time: 0.95 },
        { value: 0, time: 1 }
      ]
    },
    scale: {
      start: 4,
      end: 8,
      minimumScaleMultiplier: 0.5
    },
    speed: {
      start: 200,
      end: 100,
      minimumSpeedMultiplier: 0.9
    },
    startRotation: {
      min: 0,
      max: 0
    },
    rotation: 0,
    rotationSpeed: {
      min: 0,
      max: 0
    },
    lifetime: {
      min: 0.1,
      max: 10
    },
    blendMode: "normal",
    emitterLifetime: 0.3
  },
  {
    inplace: false
  }
);
