/**
 * Extend a tour class with with closing all apps during _preStep, if requested by the current step.
 * @param {typeof Tour} Base The base tour class which this mixin extends
 * @returns The extended tour class
 */
export function CloseAppsMixin(Base) {
  return class CloseAppsTour extends Base {
    /** @override */
    async _preStep() {
      await super._preStep();

      const step = this.currentStep;
      if (step.closeApps) {
        await Promise.all(Object.values(ui.windows).map((app) => app.close()));
      }
    }
  };
}
