export class FireballEffect extends SpecialEffect {
  constructor(parent) {
    super(parent);

    this._x = 0;
    this._y = 0;
    this._spriteSize = 512;
    this._effectSize = 350;
  }

  static get label() {
    return "Fireball";
  }

  static get icon() {
    return "/modules/fxmaster/icons/fireball.png";
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

  rescale(value) {
    let factor = value / this._effectSize;
    this.emitters[0].spawnCircle.r = factor * 10;
    console.log(factor);
    let config = FireballEffect.CONFIG.scale.list;
    this.emitters.forEach((el) => {
      let i = 0;
      let node = el.startScale;
      while (node) {
        node.value = factor * config[i].value;
        node = node.next;
        i++;
      }
    });
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
        maxParticles: 300,
        frequency: 0.0001,
      },
      {
        inplace: false,
      }
    );
    const art = [
      "/modules/fxmaster/effects/assets/flame_01.png",
      "/modules/fxmaster/effects/assets/flame_03.png",
    ];
    var emitter = new PIXI.particles.Emitter(parent, art, config);
    return emitter;
  }
}

FireballEffect.CONFIG = mergeObject(
  SpecialEffect.DEFAULT_CONFIG,
  {
    alpha: {
      list: [
        { value: 0, time: 0 },
        { value: 0.7, time: 0.01 },
        { value: 0.6, time: 0.85 },
        { value: 0.3, time: 0.9 },
        { value: 0, time: 1 },
      ],
    },
    color: {
      start: "ff8103",
      end: "ff8103",
    },
    scale: {
      list: [
        { value: 0, time: 0 },
        { value: 0.5, time: 0.07 },
        { value: 0.66, time: 0.15 },
        { value: 1, time: 0.95 },
        { value: 0.66, time: 1 },
      ],
      minimumScaleMultiplier: 0.9,
    },
    speed: {
      start: 0,
      end: 0,
    },
    acceleration: {
      x: 0,
      y: 0,
    },
    startRotation: {
      min: 0,
      max: 360,
    },
    rotation: 0,
    rotationSpeed: {
      min: 0,
      max: 20,
    },
    lifetime: {
      min: 3,
      max: 4,
    },
    addAtBack: false,
    blendMode: "normal",
    emitterLifetime: 1,
  },
  {
    inplace: false,
  }
);
