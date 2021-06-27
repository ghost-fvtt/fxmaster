export class FXColorFilter extends PIXI.filters.AdjustmentFilter {
  constructor(options) {
    super();
    this.enabled = false;
    this.skipFading = false;
    this.configure(options);
  }

  static get label() {
    return "Color";
  }

  static get faIcon() {
    return "fas fa-palette";
  }

  static get parameters() {
    return {
      color: {
        label: "FXMASTER.Tint",
        type: "color",
        default: {
          value: "#FFFFFF",
          apply: false
        }
      },
      saturation: {
        label: "FXMASTER.Saturation",
        type: "range",
        max: 2.0,
        min: 0.0,
        step: 0.1,
        default: 1.0
      },
      contrast: {
        label: "FXMASTER.Contrast",
        type: "range",
        max: 2.0,
        min: 0.0,
        step: 0.1,
        default: 1.0
      },
      brightness: {
        label: "FXMASTER.Brightness",
        type: "range",
        max: 2.0,
        min: 0.0,
        step: 0.1,
        default: 1.0
      },
      gamma: {
        label: "FXMASTER.Gamma",
        type: "range",
        max: 2.0,
        min: 0.0,
        step: 0.1,
        default: 1.0
      }
    }
  }

  static get zeros() {
    return {
      red: 1,
      green: 1,
      blue: 1,
      saturation: 1,
      gamma: 1,
      brightness: 1,
      contrast: 1
    }
  }

  static get default() {
    return Object.keys(this.parameters).reduce((def, key) => {
      def[key] = this.parameters[key].default;
      return def;
    }, {});
  }

  configure(opts) {
    if (opts.color.apply) {
      const colors = foundry.utils.hexToRGB(colorStringToHex(opts.color.value));
      opts.red = colors[0];
      opts.green = colors[1];
      opts.blue = colors[2];
    } else {
      opts.red = opts.green = opts.blue = 1;
    }
    this.options = { ...this.constructor.default, ...opts };
  }

  applyOptions(opts = this.options) {
    if (!opts) return;
    const keys = Object.keys(opts);
    for (const key of keys) {
      this[key] = opts[key];
    }
  }

  animateOptions(values = this.options) {
    const data = {
      name: `fxmaster.${this.constructor.name}`,
      duration: 4000
    }
    const anim = Object.keys(values).reduce((arr, key) => {
      arr.push({
        parent: this,
        attribute: key,
        to: values[key]
      });
      return arr;
    }, [])
    return CanvasAnimation.animateLinear(anim, data);
  }

  step() {
  }

  play() {
    this.enabled = true;
    if (this.skipFading) {
      this.skipFading = false;
      this.applyOptions();
      return;
    }
    return this.animateOptions();
  }

  // So we can destroy object afterwards
  stop() {
    return new Promise((resolve) => {
      if (this.skipFading) {
        this.skipFading = false;
        this.enabled = false;
        this.applyOptions(this.constructor.zeros);
        resolve();
        return;
      }
      this.animateOptions(this.constructor.zeros).finally(() => {
        this.enabled = false;
        resolve();
      });
    });
  }
}
