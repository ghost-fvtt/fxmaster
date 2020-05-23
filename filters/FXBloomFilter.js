export class FXBloomFilter extends PIXI.filters.AdvancedBloomFilter {
  constructor(options) {
    super();
    this.enabled = false;
    this.skipFading = false;
    this.threshold = 1.0;
    this.bloomScale = 0.5;
    this.blur = 10;
    this._step = 0;
    this._bloomRange = [0.52, 0.54, 0.54, 0.56, 0.52, 0.51, 0.50, 0.49, 0.5, 0.51];
    this.play();
  }

  static get label() {
    return "Bloom";
  }

  play() {
    this.enabled = true;
    if (this.skipFading) {
      this.skipFading = false;
      this.threshold = 0.0;
      return;
    }
    let anim = {
      ease: Linear.easeNone,
      repeat: 0,
      threshold: 0.0,
    };
    this.transition = TweenMax.to(this, 4, anim);
  }

  step() {
    this._step++;
    if (this._step % 5) return;
    this.blur = 10 + 5 * this._bloomRange[(this._step / 5) % 10];
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
      if (this.skipFading) {
        this.skipFading = false;
        this.enabled = false;
        this.threshold = 1.0;
        resolve();
        return;
      }
      let anim = {
        ease: Linear.easeNone,
        repeat: 0,
        threshold: 1.0,
        onComplete: () => {
          this.enabled = false;
          resolve();
        }
      };
      this.transition = TweenMax.to(this, 4, anim);
    });
  }
}
