export class FXBloomFilter extends PIXI.filters.AdvancedBloomFilter {
  constructor(options) {
    super();
    this.enabled = false;
    this.skipFading = false;
    this.threshold = 0.5;
    this.bloomScale = 0.0;
    this.blur = 0.0;
    this.options = options;
  }

  static get label() {
    return "Bloom";
  }

  static get faIcon() {
    return "fas fa-ghost";
  }

  static get parameters() {
    return {
      noise: {
        label: "FXMASTER.Blur",
        type: "range",
        max: 10.0,
        min: 0.0,
        step: 1.0,
        default: 1.0
      },
      bloom: {
        label: "FXMASTER.Bloom",
        type: "range",
        max: 1.0,
        min: 0.0,
        step: 0.1,
        default: 0.1
      },
      threshold: {
        label: "FXMASTER.Threshold",
        type: "range",
        max: 1.0,
        min: 0.0,
        step: 0.1,
        default: 0.5
      },
    }
  }

  play() {
    this.enabled = true;
    if (this.skipFading) {
      this.skipFading = false;
      this.threshold = this.options.threshold;
      this.bloomScale = this.options.bloom;
      this.blur = this.options.blur;
      return;
    }
    const data = {
      name: "fxmaster.bloomFilter",
      duration: 3000
    };
    const anim = [{
      parent: this,
      attribute: "bloomScale",
      to: this.options.bloom,
    }, {
      parent: this,
      attribute: "threshold",
      to: this.options.threshold,
    }, {
      parent: this,
      attribute: "blur",
      to: this.options.blur,
    }];
    return CanvasAnimation.animateLinear(anim, data);
  }

  step() { }

  configure(opts) {
    if (!opts) return;
    const keys = Object.keys(opts);
    for (let i = 0; i < keys.length; ++i) {
      this[keys[i]] = opts[keys[i]];
    }
  }

  // So we can destroy object afterwards
  stop() {
    return new Promise(async (resolve, reject) => {
      await CanvasAnimation.terminateAnimation("fxmaster.bloomFilter");
      if (this.skipFading) {
        this.skipFading = false;
        this.enabled = false;
        this.bloomScale = 0.0;
        resolve();
        return;
      }
      const data = {
        name: "fxmaster.bloomFilter",
        duration: 3000
      };
      const anim = [{
        parent: this,
        attribute: "bloomScale",
        to: 0.0
      }, {
        parent: this,
        attribute: "blur",
        to: 0.0
      }];
      CanvasAnimation.animateLinear(anim, data).finally(() => {
        this.enabled = false;
        resolve();
      });
    });
  }
}
