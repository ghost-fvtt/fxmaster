import { FXCanvasAnimation } from "../../module/canvasanimation.js"
import { easeFunctions } from "../../module/ease.js";

export class FXLightningFilter extends PIXI.filters.AdjustmentFilter {
  constructor(options) {
    super();
    this.enabled = false;
    this.configure(options);

    this.next = canvas.app.ticker.lastTime / 10;
  }

  static get label() {
    return "Lightning";
  }

  static get faIcon() {
    return "fas fa-bolt";
  }

  static get parameters() {
    return {
      frequency: {
        label: "FXMASTER.Period",
        type: "range",
        max: 2000,
        min: 100,
        step: 5,
        default: 500
      },
      spark_duration: {
        label: "FXMASTER.Duration",
        type: "range",
        max: 2000,
        min: 100,
        step: 5,
        default: 300
      },
      brightness: {
        label: "FXMASTER.Brightness",
        type: "range",
        max: 4.0,
        min: 0.0,
        step: 0.1,
        default: 1.3
      },
    }
  }

  static get zeros() {
    return {
      frequency: 0.0,
      spark_duration: 0.0,
      brightness: 1.0
    }
  }

  play() {
    this.enabled = true;
  }

  step() {
    if (canvas.app.ticker.lastTime / 10 > this.next) {
      this.next = canvas.app.ticker.lastTime / 10 + 40 + this.options.frequency * Math.random();

      const animate = (target) => {
        const attributes = [{
          parent: this, attribute: 'brightness', to: target
        }];
        return FXCanvasAnimation.animateSmooth(attributes, {
          name: `fxmaster.filters.${randomID()}.lightning`,
          context: this,
          duration: 100 + this.options.spark_duration * Math.random(),
          ease: easeFunctions.InOutBack
        })
      }

      animate(this.options.brightness).then(() => {
        animate(1.0);
      })
    }
  }

  static get default() {
    return Object.keys(this.parameters).reduce((def, key) => {
      def[key] = this.parameters[key].default;
      return def;
    }, {});
  }

  configure(opts) {
    const merged = { ...this.constructor.default, ...opts };
    this.options = merged;
  }

  applyOptions(opts = this.options) {
    if (!opts) return;
    const keys = Object.keys(opts);
    for (const key of keys) {
      this[key] = opts[key];
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
