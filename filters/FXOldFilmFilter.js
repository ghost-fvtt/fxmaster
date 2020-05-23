export class FXOldFilmFilter extends PIXI.filters.OldFilmFilter {
  constructor(options) {
    super();
    this.enabled = false;
    this.vignetting = 0;
    this.noise = 0.08;
    this.scratch = 0.1;
    this.scratchDensity = 0.1;
    this.play();
  }

  static get label() {
    return "Old Film";
  }

  play() {
    this.enabled = true;
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
