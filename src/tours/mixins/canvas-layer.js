/**
 * Extend a tour class with functionality to to activate a canvas layer, if needed by the step, via
 * the `layer` property of the step.
 * @param {typeof Tour} Base The base tour class which this mixin extends
 * @returns The extended tour class
 */
export function CanvasLayerMixin(Base) {
  return class CanvasLayerTour extends Base {
    /** @override */
    async _preStep() {
      await super._preStep();
      this.#activateLayer();
    }

    /**
     * Activate a canvas layer, if specified by the current step
     */
    #activateLayer() {
      if ("layer" in this.currentStep) {
        const layer = canvas[this.currentStep.layer];
        if (!layer.active) layer.activate();
      }
    }
  };
}
