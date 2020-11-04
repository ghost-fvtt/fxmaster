export class NatureEffect extends SpecialEffect {
  constructor(parent) {
    super(parent);

    this._x = 0;
    this._y = 0;
  }

  static get label() {
    return "Nature";
  }

  static get icon() {
    return "modules/fxmaster/icons/nature.png";
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
        maxParticles: 500,
        frequency: 0.01
      },
      {
        inplace: false
      }
    );
    const art = [
      "/ui/particles/leaf1.png",
      "/ui/particles/leaf2.png",
      "/ui/particles/leaf3.png",
      "/ui/particles/leaf4.png",
      "/ui/particles/leaf5.png",
      "/ui/particles/leaf6.png"
    ];
    var emitter = new PIXI.particles.Emitter(parent, art, config);
    emitter.particleConstructor = PIXI.particles.PathParticle;
    return emitter;
  }
}

NatureEffect.CONFIG = mergeObject(
  SpecialEffect.DEFAULT_CONFIG,
  {
    alpha: {
      list: [
        { value: 0, time: 0 },
        { value: 0.9, time: 0.02 },
        { value: 0.9, time: 0.95 },
        { value: 0, time: 1 }
      ]
    },
    scale: {
      start: 0.3,
      end: 0.3,
      minimumScaleMultiplier: 1
    },
    speed: {
      start: 100,
      end: 65,
      minimumSpeedMultiplier: 0.5
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
      min: 40,
      max: 40
    },
    lifetime: {
      min: 2,
      max: 10
    },
    pos: {
      x: 0,
      y: 0
    },
    extraData: {
      path: "cos(x/50)*100"
    },
    addAtBack: false,
    blendMode: "normal",
    emitterLifetime: 0.8
  },
  {
    inplace: false
  }
);
