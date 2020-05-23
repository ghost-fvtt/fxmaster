export class FXUnderwaterFilter extends PIXI.filters.DisplacementFilter {
  constructor(options) {
    let dizzyMap = new PIXI.Sprite.from(
      "/modules/fxmaster/filters/assets/clouds.png"
    );
    super(dizzyMap);
    this.dizzyMap = dizzyMap;
    this.transition = null;

    this.dizzyMap.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    this.dizzyMap.anchor.set(0.5);
    this.dizzyMap.x = canvas.scene.data.width / 2;
    this.dizzyMap.y = canvas.scene.data.height / 2;
    this.dizzyMap.scale.x = 4;
    this.dizzyMap.scale.y = 4;
    
    canvas.background.addChild(this.dizzyMap);
    this.enabled = false;
    this.play();
  }

  static get label() {
    return "Underwater";
  }

  step() {
    this.maskSprite.x += 0.3;
  }

  play() {
    this.enabled = true;
  }

  configure(opts) {
    if (!opts) return;
    const keys = Object.keys(opts);
    for (let i = 0; i < keys.length; ++i) {
      this[keys[i]] = opts[keys[i]];
    }
    this.play();
  }

  // So we can destroy object afterwards
  stop() {
    return new Promise((resolve, reject) => {
      this.enabled = false;
      resolve();
    });
  }
}
