import { FadingFilterMixin } from "./mixins/fading-filter.js";

export class BloomFilter extends FadingFilterMixin(PIXI.filters.AdvancedBloomFilter) {
  /** @override */
  static label = "FXMASTER.FilterEffectBloom";

  /** @override */
  static icon = "fas fa-ghost";

  /** @override */
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

  /** @override */
  static get neutral() {
    return {
      noise: 0.0,
      bloomScale: 0.0,
      threshold: 1.0,
    };
  }
}
