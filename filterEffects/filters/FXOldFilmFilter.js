export class FXOldFilmFilter extends PIXI.filters.OldFilmFilter {
  constructor(options) {
    super();
    this.enabled = false;
    this.vignetting = 0;
    this.noise = 0.08;
    this.scratch = 0.1;
    this.scratchDensity = 0.1;
    this.sepia = 0.3;
    this.options = options;
  }

  static get label() {
    return "Old Film";
  }

  static get faIcon() {
    return "fas fa-film";
  }
  
  static get parameters() {
    return {
      sepia: {
        label: "FXMASTER.Sepia",
        type: "range",
        max: 1.0,
        min: 0.0,
        step: 0.1,
        default: 0.3
      },
      noise: {
        label: "FXMASTER.Noise",
        type: "range",
        max: 1.0,
        min: 0.0,
        step: 0.1,
        default: 0.1
      }
    }
  }

  play() {
    this.enabled = true;
    this.sepia = this.options.sepia;
    this.noise = this.options.noise;
    this.seed = Math.random();
  }

  step() {
    this.seed = Math.random();
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
