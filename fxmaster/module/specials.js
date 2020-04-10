export class SpecialsConfig extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["sidebar-popout"],
      closeOnSubmit: true,
      submitOnChange: false,
      submitOnClose: false,
      popOut: true,
      editable: game.user.isGM,
      width: 120,
      height: 200,
      template: "modules/fxmaster/templates/specials-config.html",
      id: "specials-config",
      title: game.i18n.localize("EFFECTCONTROLS.Title"),
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
      effects: CONFIG.fxmaster.effects,
    };
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find('.special-effects h4').click(event => {
        let list = event.currentTarget.closest('.directory-list');
        let items = $(list).find('.directory-item');
        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove('active');
        }
        event.currentTarget.parentElement.classList.add('active');
    });
  }

  /**
   * This method is called upon form submission after form data is validated
   * @param event {Event}       The initial triggering submission event
   * @param formData {Object}   The object of validated form data with which to update the object
   * @private
   */
  _updateObject(_, formData) {}
}
