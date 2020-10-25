export class SacredFlameEffect extends SpecialEffect {
  constructor(parent) {
    super(parent);

    this._x = 0;
    this._y = 0;
  }

  static get label() {
    return "Sacred Flame";
  }

  static get icon() {
    return "/modules/fxmaster/icons/sacredflame.png";
  }

  /* -------------------------------------------- */

  static get effectOptions() {
    const options = super.effectOptions;
    options.density.min = 0.9;
    options.density.value = 1.0;
    options.density.max = 1.0;
    options.density.step = 0.1;
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
    const config = mergeObject(
      this.constructor.CONFIG,
      {
        spawnType: "circle",
        spawnCircle: {
          x: 0,
          y: 0,
          r: 10,
        },
        maxParticles: 500,
        frequency: 0.0001,
      },
      {
        inplace: false,
      }
    );
    let gridSize = canvas.scene.data.grid;
    if (gridSize) {
      config.spawnCircle.r = 0.5 * canvas.scene.data.grid;
      // Adapt scale to grid size
      config.scale.start *= gridSize / 128;
      config.scale.end *= gridSize / 128;
    }
    const art = [
      "./modules/fxmaster/effects/assets/Fire.png",
      "./modules/fxmaster/effects/assets/particle.png",
    ];
    var emitter = new PIXI.particles.Emitter(parent, art, config);
    return emitter;
  }
}

SacredFlameEffect.CONFIG = mergeObject(
  SpecialEffect.DEFAULT_CONFIG,
  {
    alpha: {
      start: 0.62,
      end: 0,
    },
    color: {
      start: "ff622c",
      end: "fff191",
    },
    scale: {
      start: 0.9,
      end: 0.8,
    },
    speed: {
      start: 500,
      end: 500,
    },
    acceleration: {
      x: 0,
      y: 0,
    },
    startRotation: {
      min: 85,
      max: 95,
    },
    rotation: 0,
    rotationSpeed: {
      min: 50,
      max: 50,
    },
    lifetime: {
      min: 0.1,
      max: 0.75,
    },
    addAtBack: false,
    blendMode: "normal",
    emitterLifetime: 1,
  },
  {
    inplace: false,
  }
);
