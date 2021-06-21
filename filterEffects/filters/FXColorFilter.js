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
      alpha: {
        label: "FXMASTER.Alpha",
        type: "range",
        max: 1.0,
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
      this.alpha = this.options.alpha;
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
      attribute: "alpha",
      to: this.options.alpha,
    }];
    this.transition = CanvasAnimation.animateLinear(anim, data);
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
        this.alpha = 1.0;
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
        attribute: "alpha",
        to: 1.0
      }];
      this.transition = CanvasAnimation.animateLinear(anim, data);
      this.transition.finally(() => {
        //   this.enabled = false;
        resolve();
      })
    });
  }
}
