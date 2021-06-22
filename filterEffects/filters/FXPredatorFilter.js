export class FXPredatorFilter extends PIXI.filters.CRTFilter {
  constructor(options) {
    super();
    this.enabled = false;
    this.vignetting = 0;
    this.curvature = 0;

    this.configure(options);
  }

  static get label() {
    return "Predator";
  }

  static get faIcon() {
    return "fas fa-wave-square";
  }
  
  static get parameters() {
    return {
      noise: {
        label: "FXMASTER.Noise",
        type: "range",
        max: 1.0,
        min: 0.0,
        step: 0.1,
        default: 0.1
      },
      period: {
        label: "FXMASTER.Speed",
        type: "range",
        max: 0.5,
        min: 0.0,
        step: 0.01,
        default: 0.02
      }
    }
  }

  static get zeros() {
    return {
      noise: 0,
      period: 1000
    }
  }

  play() {
    this.enabled = true;
    this.seed = Math.random();
    this.applyOptions();
  }

  step() {
    this.seed += 1;
    const frequency = 1.0 / this.options.period;
    this.time = canvas.app.ticker.lastTime / frequency;
  }

  static get default() {
    return Object.keys(this.parameters).reduce((def, key) => {
      def[key] = this.parameters[key].default;
      return def;
    }, {});
  }

  configure(opts) {
    this.options = { ...this.constructor.default, ...opts };
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
    return new Promise((resolve, reject) => {
      this.enabled = false;
      this.applyOptions(this.constructor.zeros);
      resolve();
    });
  }
}
