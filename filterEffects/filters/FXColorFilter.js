export class FXColorFilter extends PIXI.filters.AdjustmentFilter {
  constructor(options) {
    super();
    this.options = options;
    this.enabled = false;
    this.skipFading = false;
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
        default: "#FFFFFF"
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

  step() {
  }

  play() {
    this.enabled = true;
    const colors = foundry.utils.hexToRGB(colorStringToHex(this.options.color));
    if (this.skipFading) {
      this.skipFading = false;
      this.red = colors[0];
      this.green = colors[1];
      this.blue = colors[2];
      this.saturation = this.options.saturation;
      this.gamma = this.options.gamma;
      this.contrast = this.options.contrast;
      this.brightness = this.options.brightness;
      return;
    }
    const data = {
      name: "fxmaster.colorFilter",
      duration: 4000,
    };
    const anim = [{
      parent: this,
      attribute: "red",
      to: colors[0]
    },
    {
      parent: this,
      attribute: "green",
      to: colors[1]
    },
    {
      parent: this,
      attribute: "blue",
      to: colors[2]
    }, {
      parent: this,
      attribute: "saturation",
      to: this.options.saturation,
    }, {
      parent: this,
      attribute: "contrast",
      to: this.options.contrast,
    }, {
      parent: this,
      attribute: "brightness",
      to: this.options.brightness,
    }, {
      parent: this,
      attribute: "gamma",
      to: this.options.gamma,
    }];
    return CanvasAnimation.animateLinear(anim, data);
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
    return new Promise((resolve) => {
      if (this.skipFading) {
        this.skipFading = false;
        this.enabled = false;
        this.red = 1;
        this.blue = 1;
        this.green = 1;
        this.gamma = 1.0;
        this.saturation = 1.0;
        this.brightness = 1.0;
        this.contrast = 1.0;
        resolve();
        return;
      }
      CanvasAnimation.terminateAnimation("fxmaster.colorFilter");
      const data = {
        name: "fxmaster.colorFilter",
        duration: 4000
      };
      const anim = [{
        parent: this,
        attribute: "blue",
        to: 1.0
      }, {
        parent: this,
        attribute: "red",
        to: 1.0
      },
      {
        parent: this,
        attribute: "green",
        to: 1.0
      },
      {
        parent: this,
        attribute: "saturation",
        to: 1.0
      },
      {
        parent: this,
        attribute: "contrast",
        to: 1.0
      },
      {
        parent: this,
        attribute: "brightness",
        to: 1.0
      },
      {
        parent: this,
        attribute: "gamma",
        to: 1.0
      },
      ];
      CanvasAnimation.animateLinear(anim, data).finally(() => {
        this.enabled = false;
        resolve();
      })
    });
  }
}
