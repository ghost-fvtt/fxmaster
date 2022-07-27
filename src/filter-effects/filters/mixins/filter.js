/**
 * A mixin which extends {@link PIXI.Filter} with some common behavior.
 * @param {PIXI.Filter} Base The base filter class which this mixin extends
 * @returns The extended filter class
 */
export function FXMasterFilterEffectMixin(Base) {
  return class extends Base {
    /**
     * @param {object} options Additional options to configure the filter
     * @param {string} id The id which identifies this filter instance
     * @param  {...any} args Additional arguments to pass to the Base constructor
     */
    constructor(options, id, ...args) {
      super(...args);
      this.id = id;
      this.enabled = false;
      this.configure(options);
      this.applyOptions(this.constructor.neutral);
    }

    /**
     * The id which identifies this filter effect instance.
     * @type {string}
     */
    id;

    /**
     * The current options for this filter effect.
     * @type {object}
     */
    options;

    /**
     * A human-readable label for the filter effect. This can be a localization string.
     * @type {string}
     */
    static label = "FXMASTER.FilterEffect";

    /**
     * A Font Awesome icon to display for this filter effect in the {@link FilterEffectsManagementConfig}.
     * @type {string}
     */
    static icon = "fas fa-filter";

    /**
     * The set of parameters the filter effect supports.
     * @type {object}
     */
    static get parameters() {
      return {};
    }

    /**
     * The default values for the parameters of this filter effect.
     * @type {object}
     */
    static get default() {
      return Object.fromEntries(
        Object.entries(this.parameters).map(([parameterName, parameterConfig]) => [
          parameterName,
          parameterConfig.value,
        ]),
      );
    }

    /**
     * The set of options for this filter effect that represent a neutral state.
     */
    static get neutral() {
      return {};
    }

    /**
     * Configure the options for this filter.
     * @param {object | undefined} options The options to use
     */
    configure(options) {
      if (!options) {
        return;
      }
      this.options = { ...this.constructor.default, ...options };
    }

    /**
     * Apply options to this filter effect, setting the corresponding properties on this effect itself.
     * @param {object} options The options to apply
     */
    applyOptions(options = this.options) {
      const keys = Object.keys(options);
      for (const key of keys) {
        this[key] = options[key];
      }
    }

    /**
     * Play this filter.
     * @param {object} _options Additional options to adjust the playing behavior
     */
    play(_options = {}) {
      this.applyOptions();
      this.enabled = true;
    }

    /**
     * Stop this filter.
     * @param {object} _options Additional options to adjust the stopping behavior
     * @returns {Promise<boolean>} A promise that resolves to `true` once the stop operation has concluded or `false` if
     *                             the operation was cancelled.
     */
    async stop(_options = {}) {
      this.enabled = false;
      this.applyOptions(this.constructor.neutral);
      return true;
    }

    /**
     * Perform a step in any potential animation this filter effect might have. This is called periodically by ticker.
     */
    async step() {}
  };
}
