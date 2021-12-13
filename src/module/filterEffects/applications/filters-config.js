import { resetFlags } from "../../utils.js";
import "../../../css/filters-config.css";

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
      template: "modules/fxmaster/templates/filters-config.hbs",
      id: "filters-config",
      title: game.i18n.localize("FILTERMANAGE.Title"),
    });
  }

  /* -------------------------------------------- */

  /**
   * Obtain module metadata and merge it with game settings which track current module visibility
   * @return {Object}   The data provided to the template when rendering the form
   */
  getData() {
    const currentFilters = canvas.scene.getFlag("fxmaster", "filters") ?? {};
    const activeFilters = Object.fromEntries(
      Object.values(currentFilters).map((filter) => [filter.type, filter.options]),
    );

    const filteredLayers = canvas.scene.getFlag("fxmaster", "filteredLayers") ?? {
      background: true,
      foreground: true,
      tokens: true,
      drawings: true,
    };
    // Return data to the template
    return {
      filters: CONFIG.fxmaster.filters,
      activeFilters,
      filteredLayers,
    };
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".config.filter .collapse").click((event) => this._onFilterCollapse(event));
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
   * @param {Event}  event    The initial triggering submission event
   * @param {object} formData The object of validated form data with which to update the object
   * @private
   */
  async _updateObject(_, formData) {
    const filtersDB = CONFIG.fxmaster.filters;

    const filters = Object.fromEntries(
      Object.entries(filtersDB)
        .filter(([, filterCls]) => !!formData[filterCls.label])
        .map(([filterName, filterCls]) => {
          const label = filterCls.label;

          const options = Object.fromEntries(
            Object.entries(filterCls.parameters).map(([key, parameter]) => {
              const optionValue =
                parameter.type === "color"
                  ? { apply: formData[`${label}_${key}_apply`], value: formData[`${label}_${key}`] }
                  : formData[`${label}_${key}`];

              return [key, optionValue];
            }),
          );

          const filter = {
            type: filterName,
            options,
          };
          return [`core_${filterName}`, filter];
        }),
    );

    const filteredLayers = {
      background: formData["background"],
      foreground: formData["foreground"],
      drawings: formData["drawings"],
      tokens: formData["tokens"],
    };

    await canvas.scene.setFlag("fxmaster", "filteredLayers", filteredLayers);
    resetFlags(canvas.scene, "filters", filters);
  }
}
