import { FXMasterFilterEffectMixin } from "./mixins/filter.js";

export class PredatorFilter extends FXMasterFilterEffectMixin(PIXI.filters.CRTFilter) {
  constructor(options, id) {
    super(options, id);
    this.vignetting = 0;
    this.curvature = 0;
  }

  /** @override */
  static label = "FXMASTER.FilterEffectPredator";

  /** @override */
  static icon = "fa-solid fa-wave-square";

  /** @override */
  static get parameters() {
    return {
      noise: {
        label: "FXMASTER.Noise",
        type: "range",
        max: 1.0,
        min: 0,
        step: 0.1,
        value: 0.1,
      },
      period: {
        label: "FXMASTER.Speed",
        type: "range",
        max: 0.1,
        min: 0,
        step: 0.001,
        value: 0.001,
      },
      lineWidth: {
        label: "FXMASTER.LineWidth",
        type: "range",
        max: 10,
        min: 0,
        step: 0.1,
        value: 1,
      },
    };
  }

  /** @override */
  static get neutral() {
    return {
      noise: 0,
      period: 1000,
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
    const frequency = 1.0 / this.options.period;
    this.time = canvas.app.ticker.lastTime / frequency;
    await super.step();
  }
}
