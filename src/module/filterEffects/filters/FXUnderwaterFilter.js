export class FXUnderwaterFilter extends PIXI.filters.DisplacementFilter {
  constructor(options) {
    let dizzyMap = new PIXI.Sprite.from("/modules/fxmaster/assets/filterEffects/clouds.png");
    super(dizzyMap);
    this.dizzyMap = dizzyMap;

    this.speedConfig = {};
    this.configure(options);

    this.dizzyMap.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    this.dizzyMap.anchor.set(0.5);
    this.dizzyMap.x = canvas.scene.data.width / 2;
    this.dizzyMap.y = canvas.scene.data.height / 2;
    this.dizzyMap.scale.x = 4;
    this.dizzyMap.scale.y = 4;

    this.enabled = false;
  }

  static get label() {
    return "Underwater";
  }

  static get faIcon() {
    return "fas fa-water";
  }

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
    canvas.background.addChild(this.dizzyMap);
    this.enabled = true;
    this.dizzyMap.scale.x = this.speedConfig.scale;
    this.dizzyMap.scale.y = this.speedConfig.scale;
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

  // So we can destroy object afterwards
  stop() {
    return new Promise((resolve) => {
      canvas.background.removeChild(this.dizzyMap);
      this.enabled = false;
      resolve();
    });
  }
}
