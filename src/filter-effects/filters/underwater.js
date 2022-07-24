export class UnderwaterFilter extends PIXI.filters.DisplacementFilter {
  constructor(options, id) {
    let displacemenntMap = new PIXI.Sprite.from(
      "modules/fxmaster/assets/filter-effects/effects/underwater/displacement-map.png",
    );
    super(displacemenntMap);
    this.id = id;

    this.displacementMap = displacemenntMap;

    this.speedConfig = {};
    this.configure(options);

    this.displacementMap.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    this.displacementMap.anchor.set(0.5);
    this.displacementMap.x = canvas.scene.width / 2;
    this.displacementMap.y = canvas.scene.height / 2;
    this.displacementMap.scale.x = 4;
    this.displacementMap.scale.y = 4;

    this.enabled = false;
  }

  static label = "FXMASTER.FilterEffectUnderwater";
  static icon = "fas fa-water";

  static get parameters() {
    return {
      speed: {
        label: "FXMASTER.Speed",
        type: "range",
        max: 5.0,
        min: 0.0,
        step: 0.1,
        value: 0.3,
      },
      scale: {
        label: "FXMASTER.Scale",
        type: "number",
        value: 4.0,
      },
    };
  }

  static get zeros() {
    return {
      speed: 0,
      scale: 1.0,
    };
  }

  step() {
    this.maskSprite.x += this.speedConfig.speed;
  }

  play() {
    canvas.primary.addChild(this.displacementMap);
    this.enabled = true;
    this.displacementMap.scale.x = this.speedConfig.scale;
    this.displacementMap.scale.y = this.speedConfig.scale;
  }

  static get default() {
    return Object.fromEntries(
      Object.entries(this.parameters).map(([parameterName, parameterConfig]) => [parameterName, parameterConfig.value]),
    );
  }

  configure(opts) {
    this.speedConfig = { ...this.constructor.defaults, ...opts };
  }

  applyOptions() {
    if (!this.options) return;
    const keys = Object.keys(this.options);
    for (const key of keys) {
      this[key] = this.options[key];
    }
  }

  async stop() {
    canvas.primary.removeChild(this.displacementMap);
    this.enabled = false;
    this.applyOptions(this.constructor.zeros);
  }
}
