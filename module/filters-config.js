import { filterManager } from "../filters/FilterManager.js";
import { resetFlags } from "./utils.js";

Handlebars.registerHelper("isFilterActive", function(name) {
  let flags = canvas.scene.getFlag("fxmaster", "filters");
  if (flags) {
    let objKeys = Object.keys(flags);
    for (let i = 0; i < objKeys.length; ++i) {
      let weather = CONFIG.fxmaster.filters[flags[objKeys[i]].type];
      if (weather.label === name) {
        return true;
      }
    }
  }
  return false;
});

Handlebars.registerHelper("Config", function(key, name) {
  const flags = canvas.scene.data.flags.fxmaster;
  if (flags && flags.filters) {
    const objKeys = Object.keys(flags.filters);
    for (let i = 0; i < objKeys.length; ++i) {
      const filter = CONFIG.fxmaster.filters[flags.filters[objKeys[i]].type];
      if (filter.label === name && flags.filters[objKeys[i]].options) {
        return flags.filters[objKeys[i]].options[key];
      }
    }
  }
  return 50;
});

Handlebars.registerHelper("parameter", (effect, param, key) => {
  switch (param.type) {
    case "color":
      return `<input type="color" name="${effect.label}_${key}" value="${param.default}">`;
    case "range":
      return `
        <input type="range" step="${param.step}" min="${param.min}" max="${param.max}" name="${effect.label}_${key}" value="${param.default}">
        <span class="range-value">${param.default}</span>
        `;
  }
  return "";
});

export class FiltersConfig extends FormApplication {
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
      template: "modules/fxmaster/templates/filters-config.html",
      id: "filters-config",
      title: game.i18n.localize("FILTERMANAGE.Title")
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
      filters: CONFIG.fxmaster.filters,
      currentFilters: canvas.scene.getFlag("fxmaster", "filters")
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
    const filtersDB = CONFIG.fxmaster.filters;
    const filters = {};
    Object.keys(filtersDB).forEach(key => {
      const label = filtersDB[key].label;
      if (formData[label]) {
        const filter = {
          type: key,
          options: {}
        };
        Object.keys(filtersDB[key].parameters).forEach((key) => {
          filter.options[key] = formData[`${label}_${key}`];
        })
        filters[randomID()] = filter;
      }
    });
    resetFlags(canvas.scene, "filters", filters);
  }
}

FiltersConfig.CONFIG_SETTING = "filtersConfiguration";
