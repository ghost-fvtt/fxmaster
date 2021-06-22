export class FXUnderwaterFilter extends PIXI.filters.DisplacementFilter {
  constructor(options) {
    let dizzyMap = new PIXI.Sprite.from(
      "/modules/fxmaster/filterEffects/assets/clouds.png"
    );
    super(dizzyMap);
    this.dizzyMap = dizzyMap;
    this.options = options;

    this.dizzyMap.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    this.dizzyMap.anchor.set(0.5);
    this.dizzyMap.x = canvas.scene.data.width / 2;
    this.dizzyMap.y = canvas.scene.data.height / 2;
    this.dizzyMap.scale.x = 4;
    this.dizzyMap.scale.y = 4;
    
    canvas.background.addChild(this.dizzyMap);
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
        default: 0.3
      },
      scale: {
        label: "FXMASTER.Scale",
        type: "number",
        default: 4.0
      },
    }
  }

  step() {
    this.maskSprite.x += this.options.speed;
  }

  play() {
    this.enabled = true;
    this.dizzyMap.scale.x = this.options.scale;
    this.dizzyMap.scale.y = this.options.scale;
  }

  configure(opts) {
    if (!opts) return;
    const keys = Object.keys(opts);
    for (let i = 0; i < keys.length; ++i) {
      this[keys[i]] = opts[keys[i]];
    }
  }

  // So we can destroy object afterwards
  stop() {
    return new Promise((resolve, reject) => {
      this.enabled = false;
      resolve();
    });
  }
}
