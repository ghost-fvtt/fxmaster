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

  step() {
  }

  play() {
    this.enabled = true;
    if (this.skipFading) {
      this.skipFading = false;
      this.blue = this.options.blue;
      this.red = this.options.red;
      this.green = this.options.green;
      return;
    }
    const data = {
      name: "fxmaster.colorFilter",
      duration: 4000,
    };
    const anim = [{
      parent: this,
      attribute: "blue",
      to: this.options.blue,
    }, {
      parent: this,
      attribute: "red",
      to: this.options.red
    },
    {
      parent: this,
      attribute: "green",
      to: this.options.green
    }];
    this.transition = CanvasAnimation.animateLinear(anim, data);
  }

  configure(opts) { }

  // So we can destroy object afterwards
  stop() {
    return new Promise((resolve) => {
      if (this.skipFading) {
        this.skipFading = false;
        this.enabled = false;
        this.red = 1;
        this.blue = 1;
        this.green = 1;
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
      }];
      this.transition = CanvasAnimation.animateLinear(anim, data);
      this.transition.finally(() => {
      //   this.enabled = false;
        resolve();
      })
    });
  }
}
