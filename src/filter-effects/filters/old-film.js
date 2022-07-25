import { FXMasterFilterEffectMixin } from "./mixins/filter.js";

export class OldFilmFilter extends FXMasterFilterEffectMixin(PIXI.filters.OldFilmFilter) {
  constructor(options, id) {
    super(options, id);
    this.vignetting = 0;
    this.vignettingAlpha = 0;
  }

  /** @override */
  static label = "FXMASTER.FilterEffectOldFilm";

  /** @override */
  static icon = "fas fa-film";

  /** @override */
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

  /** @override */
  static get neutral() {
    return {
      sepia: 0.0,
      noise: 0.0,
    };
  }

  /** @override */
  play(options = {}) {
    this.seed = Math.random();
    super.play(options);
  }

  /** @override */
  async step() {
    this.seed = Math.random();
    await super.step();
  }
}
