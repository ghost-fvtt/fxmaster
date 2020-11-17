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
      height: 230,
      template: "modules/fxmaster/templates/special-create.html",
      id: "add-effect",
      title: game.i18n.localize("FXMASTER.AddEffect")
    });
  }

  /* -------------------------------------------- */

  setDefault(object) {
    this.default = object;
  }

  /**
   * Obtain module metadata and merge it with game settings which track current module visibility
   * @return {Object}   The data provided to the template when rendering the form
   */
  getData() {

    const values = mergeObject({
      angle: 0,
      position: {
        x: 0,
        y: 0
      },
      anchor: {
        x: 0.5,
        y: 0.5
      },
      author: "",
      preset: false,
      scale: 1.0
    }, this.default);

    // Return data to the template
    return {
      default: values
    };
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

    const newData = {
        label: formData["label"],
        file: formData["file"],
        scale: parseFloat(formData["scale"]),
        angle: parseFloat(formData["angle"]),
        anchor: {
          x: formData["anchorX"],
          y: formData["anchorY"],
        },
        preset: false,
        author: ""
    }

    const fx = fxs.filter((f) => f.label == newData.label);
    if (fx.length > 0) {
      fx[0] = mergeObject(fx[0], newData)
    } else {
      fxs.push(newData)
    }
    game.settings.set("fxmaster", "specialEffects", fxs);
  }
}