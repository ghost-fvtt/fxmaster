import { resetFlags } from "../../module/utils.js";

export class WeatherConfig extends FormApplication {
  constructor() {
    super();
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["form", "fxmaster", "sidebar-popout"],
      closeOnSubmit: true,
      submitOnChange: false,
      submitOnClose: false,
      popOut: true,
      editable: game.user.isGM,
      width: 300,
      height: 450,
      template: "modules/fxmaster/weatherEffects/templates/weather-config.html",
      id: "effects-config",
      title: game.i18n.localize("WEATHERMANAGE.Title")
    });
  }

  /* -------------------------------------------- */

  /**
   * Obtain module metadata and merge it with game settings which track current module visibility
   * @return {Object}   The data provided to the template when rendering the form
   */
  getData() {
    // Return data to the template
    const currentEffects = canvas.scene.getFlag("fxmaster", "effects");
    const activeEffects = Object.values(currentEffects).reduce((obj, f) => {
      obj[f.type] = f.options;
      return obj;
    }, {});
    return {
      effects: CONFIG.weatherEffects,
      activeEffects: activeEffects
    };
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html
      .find(".config.weather .weather-collapse")
      .click(event => this._onWeatherCollapse(event));
  }

  /**
   * Handle Weather collapse toggle
   * @private
   */
  _onWeatherCollapse(event) {
    let li = $(event.currentTarget).parents(".config.weather"),
      expanded = !li.children(".config.collapsible").hasClass("collapsed");
    this._collapse(li, expanded);
  }

  /* -------------------------------------------- */

  /**
   * Helper method to render the expansion or collapse of playlists
   * @param {HTMLElement} li
   * @param {boolean} collapse
   * @param {number} speed
   * @private
   */
  _collapse(li, collapse, speed = 250) {
    li = $(li);
    let ol = li.children(".config.collapsible"),
      icon = li.find("header i.fa");
    // Collapse the Playlist
    if (collapse) {
      ol.slideUp(speed, () => {
        ol.addClass("collapsed");
        icon.removeClass("fa-angle-up").addClass("fa-angle-down");
      });
    }

    // Expand the Playlist
    else {
      ol.slideDown(speed, () => {
        ol.removeClass("collapsed");
        icon.removeClass("fa-angle-down").addClass("fa-angle-up");
      });
    }
  }

  /**
   * This method is called upon form submission after form data is validated
   * @param event {Event}       The initial triggering submission event
   * @param formData {Object}   The object of validated form data with which to update the object
   * @private
   */
  async _updateObject(_, formData) {
    const effects = {};
    Object.keys(CONFIG.weatherEffects).forEach(key => {
      let label = CONFIG.weatherEffects[key].label;
      if (formData[label]) {
        effects[randomID()] = {
          type: key,
          options: {
            density: formData[`${label}_density`],
            speed: formData[`${label}_speed`],
            scale: formData[`${label}_scale`],
            tint: formData[`${label}_tint`],
            direction: formData[`${label}_direction`],
            apply_tint: formData[`${label}_apply_tint`]
          }
        };
      }
    });
    resetFlags(canvas.scene, "effects", effects);

  }
}

WeatherConfig.CONFIG_SETTING = "effectsConfiguration";
