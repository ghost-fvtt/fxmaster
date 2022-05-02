import { packageId } from "../../constants.js";

export class BloomFilter extends PIXI.filters.AdvancedBloomFilter {
  constructor(options, id) {
    super();
    this.id = id;

    this.enabled = false;
    this.skipFading = false;
    this.configure(options);
  }

  static label = "FXMASTER.FilterEffectBloom";
  static icon = "fas fa-ghost";

  static get parameters() {
    return {
      blur: {
        label: "FXMASTER.Blur",
        type: "range",
        max: 10.0,
        min: 0.0,
        step: 1.0,
        value: 1.0,
      },
      bloomScale: {
        label: "FXMASTER.Bloom",
        type: "range",
        max: 1.0,
        min: 0.0,
        step: 0.1,
        value: 0.1,
      },
      threshold: {
        label: "FXMASTER.Threshold",
        type: "range",
        max: 1.0,
        min: 0.0,
        step: 0.1,
        value: 0.5,
      },
    };
  }

  static get zeros() {
    return {
      noise: 0.0,
      bloomScale: 0.0,
      threshold: 1.0,
    };
  }

  static get default() {
    return Object.fromEntries(
      Object.entries(this.parameters).map(([parameterName, parameterConfig]) => [parameterName, parameterConfig.value]),
    );
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

  step() {}

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
      name: `${packageId}.${this.constructor.name}.${this.id}`,
      duration: 4000,
    };
    const anim = Object.keys(values).reduce((arr, key) => {
      arr.push({
        parent: this,
        attribute: key,
        to: values[key],
      });
      return arr;
    }, []);
    return CanvasAnimation.animate(anim, data);
  }

  // So we can destroy object afterwards
  async stop() {
    await CanvasAnimation.terminateAnimation(`${packageId}.${this.constructor.name}.${this.id}`);
    if (this.skipFading) {
      this.skipFading = false;
      this.enabled = false;
      this.applyOptions(this.constructor.zeros);
      return;
    }
    this.animateOptions(this.constructor.zeros).finally(() => {
      this.enabled = false;
    });
  }
}
