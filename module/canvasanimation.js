import {easeInSine, easeLinear, easeOutSine, easeInOutSine, easeInOutCirc, easeInBack} from "./ease.js"

export class FXCanvasAnimation extends CanvasAnimation {
  static async animateSmooth(attributes, {context, name=null, duration=1000, ontick}={}) {
    // Prepare attributes
    attributes = attributes.map(a => {
      a.delta = a.to - a.parent[a.attribute];
      a.done = 0;
      a.remaining = duration;
      return a;
    }).filter(a => a.delta !== 0);

    // Register the request function and context
    context = context || canvas.stage;

    // Dispatch the animation request and return as a Promise
    return this._animatePromise(this._animateFrameSmooth, context, name, attributes, duration, ontick);
  }
  
  static _animateFrameSmooth(deltaTime, resolve, reject, attributes, duration, ontick) {
    let complete = attributes.length === 0;
    console.log(duration, deltaTime, PIXI.settings.TARGET_FPMS);
    // Update each attribute
    const dt = (duration * PIXI.settings.TARGET_FPMS) / deltaTime;
    try {
      for (let a of attributes) {
        let da = a.delta / dt;
        a.d = da;
        if ( a.remaining < (Math.abs(dt) * 1.25) ) {
          a.parent[a.attribute] = a.to;
          a.done = duration;
          a.remaining = 0;
          complete = true;
        } else {
          const x = a.done / (duration);
          console.log(x);
          a.done += dt;
          a.parent[a.attribute] = a.to - a.delta + a.delta * easeLinear(x);
          a.remaining = duration - a.done;
        }
      }
      if (ontick) ontick(dt, attributes);
    }
    catch (err) {
      reject(err);
    }

    // Resolve the original promise once the animation is complete
    if (complete) resolve();
  }

}