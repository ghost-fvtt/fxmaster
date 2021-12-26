import { resetFlags } from "../../utils.js";
import "../../../css/weather-config.css";

export class WeatherConfig extends FormApplication {
  constructor() {
    super();
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["form", "fxmaster", "weathers", "sidebar-popout"],
      closeOnSubmit: true,
      submitOnChange: false,
      submitOnClose: false,
      popOut: true,
      editable: game.user.isGM,
      width: 300,
      height: "auto",
      template: "modules/fxmaster/templates/weather-config.hbs",
      id: "effects-config",
      title: game.i18n.localize("WEATHERMANAGE.Title"),
    });
  }

  /* -------------------------------------------- */

  /**
   * Obtain module metadata and merge it with game settings which track current module visibility
   * @return {Object}   The data provided to the template when rendering the form
   */
  getData() {
    const currentEffects = canvas.scene?.getFlag("fxmaster", "effects") ?? {};

    const activeEffects = Object.fromEntries(
      Object.values(currentEffects).map((effect) => [effect.type, effect.options]),
    );

    return {
      effects: CONFIG.fxmaster.weather,
      activeEffects,
    };
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".config.weather .collapse").click((event) => this._onWeatherCollapse(event));
    html.find('.config.weather input[type="range"]').on("input", (event) => this._onChangeRange(event));
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
    const weathersDB = CONFIG.fxmaster.weather;
    const effects = Object.fromEntries(
      Object.entries(weathersDB)
        .filter(([, weatherCls]) => !!formData[weatherCls.label])
        .map(([weatherName, weatherCls]) => {
          const label = weatherCls.label;

          const options = Object.fromEntries(
            Object.entries(weatherCls.parameters).map(([key, parameter]) => {
              const optionValue =
                parameter.type === "color"
                  ? { apply: formData[`${label}_${key}_apply`], value: formData[`${label}_${key}`] }
                  : formData[`${label}_${key}`];

              return [key, optionValue];
            }),
          );

          const weather = {
            type: weatherName,
            options,
          };
          return [`core_${weatherName}`, weather];
        }),
    );
    resetFlags(canvas.scene, "effects", effects);
  }
}
