import { FXCanvasAnimation } from "../module/canvasanimation.js"
import { easeFunctions } from "../module/ease.js";

export class FXLightningFilter extends PIXI.filters.AdjustmentFilter {
  constructor(options) {
    super();
    this.enabled = false;
    this.next = canvas.app.ticker.lastTime / 10;
    this.play();
  }

  static get label() {
    return "Lightning";
  }

  static get faIcon() {
    return "fas fa-bolt";
  }
  
  static get parameters() {
    return {}
  }
  play() {
    this.enabled = true;
  }

  step() {
    if (canvas.app.ticker.lastTime / 10 > this.next) {
      this.next = canvas.app.ticker.lastTime / 10 + 40 + 500 * Math.random();

      const animate = (target) => {
        const attributes = [{
          parent: this, attribute: 'brightness', to: target
        }];
        return FXCanvasAnimation.animateSmooth(attributes, {
          name: `fxmaster.filters.${randomID()}.lightning`,
          context: this,
          duration: 100 + 300 * Math.random(),
          ease: easeFunctions.InOutBack
        })
      }
      
      animate(1.2).then(() => {
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
