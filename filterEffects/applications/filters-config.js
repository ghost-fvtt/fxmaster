import { filterManager } from "../FilterManager.js";
import { resetFlags } from "../../module/utils.js";

export class FiltersConfig extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["form", "fxmaster", "filters", "sidebar-popout"],
      closeOnSubmit: true,
      submitOnChange: false,
      submitOnClose: false,
      popOut: true,
      editable: game.user.isGM,
      width: 300,
      height: "auto",
      template: "modules/fxmaster/filterEffects/templates/filters-config.html",
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
    const currentFilters = canvas.scene.getFlag("fxmaster", "filters") || {};
    const activeFilters = Object.values(currentFilters).reduce((obj, f) => {
      obj[f.type] = f.options;
      return obj;
    }, {});

    const filteredLayers = canvas.scene.getFlag("fxmaster", "filteredLayers");
    // Return data to the template
    return {
      filters: CONFIG.fxmaster.filters,
      activeFilters: activeFilters,
      layers: filteredLayers || {background: true, foreground: true, tokens: true, drawings: true}
    };
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html
      .find(".config.filter .collapse")
      .click(event => this._onFilterCollapse(event));
  }

  /**
   * Handle Weather collapse toggle
   * @private
   */
  _onFilterCollapse(event) {
    let li = $(event.currentTarget).parents(".config.filter"),
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
        Object.keys(filtersDB[key].parameters).forEach((k) => {
          if (filtersDB[key].parameters[k].type === "color") {
            filter.options[k] = { apply: formData[`${label}_${k}_apply`], value: formData[`${label}_${k}`] };
            return;
          }
          filter.options[k] = formData[`${label}_${k}`];
        })
        filters[`core_${key}`] = filter;
      }
    });

    const apply_to = {
      background: formData["background"],
      foreground: formData["foreground"],
      drawings: formData["drawings"],
      tokens: formData["tokens"]
    };

    canvas.scene.setFlag("fxmaster", "filteredLayers", apply_to).then(() => {
      resetFlags(canvas.scene, "filters", filters);
    });
  }
}

FiltersConfig.CONFIG_SETTING = "filtersConfiguration";
