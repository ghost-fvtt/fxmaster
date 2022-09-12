import { waitForElement } from "../../utils.js";

/**
 * Extend a tour class with waiting for the selector (if any) during _preStep
 * @param {typeof Tour} Base The base tour class which this mixin extends
 * @returns The extended tour class
 */
export function WaitForSelectorMixin(Base) {
  return class WaitForSelectorTour extends Base {
    /** @override */
    async _preStep() {
      await super._preStep();
      const step = this.currentStep;

      if (step.selector) {
        const element = await waitForElement(step.selector);
        console.log(element);
      }
    }
  };
}
