import { FXCanvasAnimation } from "../../module/canvasanimation.js"
import { easeFunctions } from "../../module/ease.js";

export class FXLightningFilter extends PIXI.filters.AdjustmentFilter {
  constructor(options) {
    super();
    this.options = options;
    this.enabled = false;
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
