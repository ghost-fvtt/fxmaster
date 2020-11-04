export class LightningEffect extends SpecialEffect {
  constructor(parent) {
    super(parent);

    this._x = 0;
    this._y = 0;

    // this.texture = PIXI.Texture.from(
    //   "./modules/fxmaster/effects/assets/light_03.png"
    // );
    // this.sphereContainer = new PIXI.Container();
  }

  static get label() {
    return "Lightning";
  }

  static get icon() {
    return "modules/fxmaster/icons/lightning.png";
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
    // this.sphere.x = coords;
  }

  set yOrigin(coords) {
    this.emitters[0].spawnCircle.y = coords;
    // this.sphere.y = coords;
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

    // this.sphere = new PIXI.Sprite(this.texture);
    // this.sphere.anchor.set(0.5);
    // parent.addChild(this.sphereContainer);
    // this.sphereContainer.addChild(this.sphere);

    const config = mergeObject(
      this.constructor.CONFIG,
      {
        spawnType: "circle",
        spawnCircle: {
          x: 0,
          y: 0,
          r: 10
        },
        maxParticles: 300,
        frequency: 0.05
      },
      {
        inplace: false
      }
    );
    const art = [
      "./modules/fxmaster/effects/assets/spark_03.png",
      "./modules/fxmaster/effects/assets/spark_04.png",
      "./modules/fxmaster/effects/assets/spark_05.png",
      "./modules/fxmaster/effects/assets/spark_06.png"
    ];
    var emitter = new PIXI.particles.Emitter(parent, art, config);
    emitter.particleConstructor = PIXI.particles.PathParticle;
    return emitter;
  }
}

LightningEffect.CONFIG = mergeObject(
  SpecialEffect.DEFAULT_CONFIG,
  {
    alpha: {
      list: [
        { value: 0, time: 0 },
        { value: 1, time: 0.02 },
        { value: 1, time: 0.95 },
        { value: 0, time: 1 }
      ]
    },
    scale: {
      start: 0.5,
      end: 0.5,
      minimumScaleMultiplier: 0.3
    },
    color: {
      start: "#c3f1fa",
      end: "#91ceff"
    },
    speed: {
      start: 0,
      end: 1,
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
      min: 0,
      max: 10
    },
    lifetime: {
      min: 0.5,
      max: 1
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
    emitterLifetime: 3
  },
  {
    inplace: false
  }
);
