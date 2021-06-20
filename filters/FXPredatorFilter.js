export class FXPredatorFilter extends PIXI.filters.CRTFilter {
  constructor(options) {
    super();
    this.enabled = false;
    this.vignetting = 0;
    this.curvature = 0;
    this.noise = 0.1;
    this.play();
  }

  static get label() {
    return "Predator";
  }

  static get faIcon() {
    return "fas fa-wave-square";
  }
  
  static get parameters() {
    return {}
  }

  play() {
    this.enabled = true;
    this.seed = Math.random();
  }

  step() {
    this.seed += 1;
    this.time = canvas.app.ticker.lastTime / 100;
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
