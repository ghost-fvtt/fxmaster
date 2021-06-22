export class FXPredatorFilter extends PIXI.filters.CRTFilter {
  constructor(options) {
    super();
    this.enabled = false;
    this.vignetting = 0;
    this.curvature = 0;
    this.noise = 0.1;
    this.options = options;
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

  play() {
    this.enabled = true;
    this.seed = Math.random();
    this.noise = this.options.noise;
  }

  step() {
    this.seed += 1;
    const frequency = 1.0 / this.options.period;
    this.time = canvas.app.ticker.lastTime / frequency;
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
