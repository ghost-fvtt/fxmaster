import { FadingFilterMixin } from "./mixins/fading-filter.js";

export class ColorFilter extends FadingFilterMixin(PIXI.filters.AdjustmentFilter) {
  /** @override */
  static label = "FXMASTER.FilterEffectColor";

  /** @override */
  static icon = "fa-solid fa-palette";

  /** @override */
  static get parameters() {
    return {
      color: {
        label: "FXMASTER.Tint",
        type: "color",
        value: {
          value: "#FFFFFF",
          apply: false,
        },
      },
      saturation: {
        label: "FXMASTER.Saturation",
        type: "range",
        max: 2.0,
        min: 0.0,
        step: 0.1,
        value: 1.0,
      },
      contrast: {
        label: "FXMASTER.Contrast",
        type: "range",
        max: 2.0,
        min: 0.0,
        step: 0.1,
        value: 1.0,
      },
      brightness: {
        label: "FXMASTER.Brightness",
        type: "range",
        max: 2.0,
        min: 0.0,
        step: 0.1,
        value: 1.0,
      },
      gamma: {
        label: "FXMASTER.Gamma",
        type: "range",
        max: 2.0,
        min: 0.0,
        step: 0.1,
        value: 1.0,
      },
    };
  }

  /** @override */
  static get neutral() {
    return {
      red: 1,
      green: 1,
      blue: 1,
      saturation: 1,
      gamma: 1,
      brightness: 1,
      contrast: 1,
    };
  }

  /** @override */
  configure(options) {
    if (!options) {
      return;
    }
    const { color, ...otherOptions } = options;
    const { r: red, g: green, b: blue } = foundry.utils.Color.from(color.apply ? color.value : 0xffffff);
    super.configure({ ...otherOptions, red, green, blue });
  }
}
