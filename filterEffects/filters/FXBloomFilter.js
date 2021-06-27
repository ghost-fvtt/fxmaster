export class FXBloomFilter extends PIXI.filters.AdvancedBloomFilter {
  constructor(options) {
    super();
    this.enabled = false;
    this.skipFading = false;
    this.configure(options);
  }

  static get label() {
    return "Bloom";
  }

  static get faIcon() {
    return "fas fa-ghost";
  }

  static get parameters() {
    return {
      blur: {
        label: "FXMASTER.Blur",
        type: "range",
        max: 10.0,
        min: 0.0,
        step: 1.0,
        default: 1.0
      },
      bloomScale: {
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

  static get zeros() {
    return {
      noise: 0.0,
      bloomScale: 0.0,
      threshold: 1.0
    }
  }

  static get default() {
    return Object.keys(this.parameters).reduce((def, key) => {
      def[key] = this.parameters[key].default;
      return def;
    }, {});
  }

  play() {
    this.enabled = true;
    if (this.skipFading) {
      this.skipFading = false;
      this.applyOptions();
      return;
    }
    return this.animateOptions();
  }

  step() { }


  configure(opts) {
    this.options = { ...this.constructor.default, ...opts };
  }

  applyOptions(opts = this.options) {
    if (!opts) return;
    const keys = Object.keys(opts);
    for (const key of keys) {
      this[key] = opts[key];
    }
  }

  animateOptions(values = this.options) {
    const data = {
      name: `fxmaster.${this.constructor.name}`,
      duration: 4000
    }
    const anim = Object.keys(values).reduce((arr, key) => {
      arr.push({
        parent: this,
        attribute: key,
        to: values[key]
      });
      return arr;
    }, [])
    return CanvasAnimation.animateLinear(anim, data);
  }

  // So we can destroy object afterwards
  stop() {
    return new Promise(async (resolve) => {
      await CanvasAnimation.terminateAnimation("fxmaster.bloomFilter");
      if (this.skipFading) {
        this.skipFading = false;
        this.enabled = false;
        this.applyOptions(this.constructor.zeros)
        resolve();
        return;
      }
      this.animateOptions(this.constructor.zeros).finally(() => {
        this.enabled = false;
        resolve();
      });
    });
  }
}
