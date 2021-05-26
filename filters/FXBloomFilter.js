export class FXBloomFilter extends PIXI.filters.AdvancedBloomFilter {
  constructor(options) {
    super();
    this.enabled = false;
    this.skipFading = false;
    this.threshold = 1.0;
    this.bloomScale = 0.5;
    this.blur = 10;
    this.play();
  }

  static get label() {
    return "Bloom";
  }

  play() {
    this.enabled = true;
    if (this.skipFading) {
      this.skipFading = false;
      this.threshold = 0.1;
      return;
    }
    const data = {
      name: "fxmaster.bloomFilter",
      duration: 4000,
    };
    const anim = [{
      parent: this,
      attribute: "threshold",
      to: 0.1,
    }];
    this.transition = CanvasAnimation.animateLinear(anim, data);
  }

  step() { }

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
      CanvasAnimation.terminateAnimation("fxmaster.bloomFilter");
      const data = {
        name: "fxmaster.bloomFilter",
        duration: 4000
      };
      const anim = [{
        parent: this,
        attribute: "threshold",
        to: 1.0
      }];
      this.transition = CanvasAnimation.animateLinear(anim, data);
      this.transition.finally(() => {
        this.enabled = false;
        resolve();
      });
    });
  }
}
