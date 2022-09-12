/**
 * A base tour class that provides common functionality for all FXMaster tours.
 */
export class FXMasterBaseTour extends Tour {
  /** @type {boolean} */
  #isProgressingOrExiting = false;

  /**
   * The index of the previous step, if any. Set at the beginning of {@link ActionsTour#progress}.
   * @type {number|null}
   * @protected
   */
  _previousStepIndex = null;

  /**
   * The index of the next step, if any. Set at the beginning of {@link ActionsTour#progress}.
   * @type {number|null}
   * @protected
   */
  _nextStepIndex = null;

  /** @override */
  exit() {
    if (this.#isProgressingOrExiting) {
      ui.notifications.info("FXMASTER.InfoWaitForStepToFinish", { localize: true });
      return;
    }

    this.#isProgressingOrExiting = true;

    try {
      super.exit();
    } finally {
      this.#isProgressingOrExiting = false;
    }
  }

  /** @override */
  async start() {
    game.togglePause(false);
    await super.start();
  }

  /** @override */
  async progress(stepIndex) {
    if (this.#isProgressingOrExiting) {
      ui.notifications.info("FXMASTER.InfoWaitForStepToFinish", { localize: true });
      return;
    }
    this.#isProgressingOrExiting = true;
    this._previousStepIndex = this.stepIndex;
    this._nextStepIndex = stepIndex;

    try {
      await super.progress(stepIndex);
    } finally {
      this.#isProgressingOrExiting = false;
    }
  }

  /** @override */
  async _preStep() {
    await super._preStep();

    const step = this.currentStep;
    await step?._preStep?.();
  }

  /** @override */
  async _postStep() {
    const step = this.currentStep;
    await step?._postStep?.();

    await super._postStep();
  }
}
