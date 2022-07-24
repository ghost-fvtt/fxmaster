export class OldFilmFilter extends PIXI.filters.OldFilmFilter {
  constructor(options, id) {
    super();
    this.id = id;

    this.enabled = false;
    this.skipFading = false;

    this.vignetting = 0;
    this.vignettingAlpha = 0;

    this.configure(options);
  }

  static label = "FXMASTER.FilterEffectOldFilm";
  static icon = "fas fa-film";

  static get parameters() {
    return {
      sepia: {
        label: "FXMASTER.Sepia",
        type: "range",
        max: 1.0,
        min: 0.0,
        step: 0.1,
        value: 0.3,
      },
      noise: {
        label: "FXMASTER.Noise",
        type: "range",
        max: 1.0,
        min: 0.0,
        step: 0.1,
        value: 0.1,
      },
    };
  }

  static get zeros() {
    return {
      sepia: 0.0,
      noise: 0.0,
    };
  }

  play() {
    this.enabled = true;
    this.seed = Math.random();
    this.applyOptions();
  }

  step() {
    this.seed = Math.random();
  }

  static get default() {
    return Object.fromEntries(
      Object.entries(this.parameters).map(([parameterName, parameterConfig]) => [parameterName, parameterConfig.value]),
    );
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

  async stop() {
    this.enabled = false;
    this.applyOptions(this.constructor.zeros);
  }
}
