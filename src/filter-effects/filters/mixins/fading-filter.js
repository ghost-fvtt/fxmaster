import { packageId } from "../../../constants.js";
import { FXMasterFilterEffectMixin } from "./filter";

/**
 * @typedef {Object} AnimationOptions
 * @property {number} [duration=4000] The duration of the animation
 */

/**
 * A mixin which extends {@link PIXI.Filter} with some common behavior and fading.
 * @param {PIXI.Filter} Base The base filter class which this mixin extends
 * @returns The extended filter class
 */
export function FadingFilterMixin(Base) {
  return class extends FXMasterFilterEffectMixin(Base) {
    /**
     * Apply options to this filter effect as an animation.
     * @param {object} [options] The options to animate
     * @param {AnimationOptions} [animationOptions={}] Additional options to adjust the animation behavior
     */
    animateOptions(options = this.options, { duration = 4_000 } = {}) {
      const name = `${packageId}.${this.constructor.name}.${this.id}`;
      const data = { name, duration };
      const anim = Object.entries(options).map(([key, value]) => ({ parent: this, attribute: key, to: value }));
      return CanvasAnimation.animate(anim, data);
    }

    /** @override */
    play({ skipFading = false, ...otherOptions } = {}) {
      if (skipFading) {
        super.play({ skipFading, ...otherOptions });
      } else {
        this.enabled = true;
        this.animateOptions();
      }
    }

    /** @override */
    async stop({ skipFading = false, ...otherOptions } = {}) {
      if (skipFading) {
        await super.stop({ skipFading, ...otherOptions });
      } else {
        try {
          await this.animateOptions(this.constructor.neutral);
        } catch (e) {
          logger.error(`Error while trying to animate ${this.constructor.name} for stopping.`, e);
        }
        this.enabled = false;
      }
    }
  };
}
