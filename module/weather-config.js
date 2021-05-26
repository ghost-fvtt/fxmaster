import { filterManager } from "../filters/FilterManager.js";
import { resetFlags } from "./utils.js";

Handlebars.registerHelper("isEffectActive", function(name) {
  let flags = canvas.scene.getFlag("fxmaster", "effects");
  if (flags) {
    let objKeys = Object.keys(flags);
    for (let i = 0; i < objKeys.length; ++i) {
      let weather = CONFIG.weatherEffects[flags[objKeys[i]].type];
      if (weather.label === name) {
        return true;
      }
    }
  }
  return false;
});

Handlebars.registerHelper("Config", function(key, name) {
  let flags = canvas.scene.data.flags.fxmaster;
  if (flags && flags.effects) {
    let objKeys = Object.keys(flags.effects);
    for (let i = 0; i < objKeys.length; ++i) {
      let weather = CONFIG.weatherEffects[flags.effects[objKeys[i]].type];
      if (weather.label === name && flags.effects[objKeys[i]].options) {
        return flags.effects[objKeys[i]].options[key];
      }
    }
  }
  if (key === "apply_tint") {
    return false
  }
  return 50;
});

export class WeatherConfig extends FormApplication {
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
      template: "modules/fxmaster/templates/effects-config.html",
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
    return {
      effects: CONFIG.weatherEffects,
      currentEffects: canvas.scene.getFlag("fxmaster", "effects")
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
            density: formData[label + "_density"],
            speed: formData[label + "_speed"],
            scale: formData[label + "_scale"],
            tint: formData[label + "_tint"],
            direction: formData[label + "_direction"],
            apply_tint: formData[label + "_apply_tint"]
          }
        };
      }
    });
    resetFlags(canvas.scene, "effects", effects);

  }
}

WeatherConfig.CONFIG_SETTING = "effectsConfiguration";
