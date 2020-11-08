export class SpecialCreate extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["form"],
      closeOnSubmit: true,
      submitOnChange: false,
      submitOnClose: false,
      popOut: true,
      editable: game.user.isGM,
      width: 300,
      height: 205,
      template: "modules/fxmaster/templates/special-create.html",
      id: "add-effect",
      title: game.i18n.localize("FXMASTER.AddEffect")
    });
  }

  /* -------------------------------------------- */

  /**
   * Obtain module metadata and merge it with game settings which track current module visibility
   * @return {Object}   The data provided to the template when rendering the form
   */
  getData() {
    // Return data to the template
    return {};
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

  }

  /**
   * This method is called upon form submission after form data is validated
   * @param event {Event}       The initial triggering submission event
   * @param formData {Object}   The object of validated form data with which to update the object
   * @private
   */
  _updateObject(_, formData) {
    let fxs = game.settings.get("fxmaster", "specialEffects")[0];
    fxs.push({
      label: formData["label"],
      file: formData["file"],
      scale: parseFloat(formData["scale"]),
      angle: formData["angle"] * Math.PI / 180.0
    });
    game.settings.set("fxmaster", "specialEffects", fxs);
  }
}