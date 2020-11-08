export class ColorizeConfig extends FormApplication {
    static get defaultOptions() {
      return mergeObject(super.defaultOptions, {
        classes: ["form"],
        closeOnSubmit: true,
        submitOnChange: false,
        submitOnClose: false,
        popOut: true,
        editable: game.user.isGM,
        width: 300,
        height: 140,
        template: "modules/fxmaster/templates/colorize-config.html",
        id: "filter-config",
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
      let rgb = hexToRGB(colorStringToHex(formData.tint));
      if (formData.apply_tint) {
        filterManager.switch("core_color", "color", formData.apply_tint, {
          red: rgb[0],
          green: rgb[1],
          blue: rgb[2]
        });
      } else {
        filterManager.removeFilter("core_color");
      }
    }
  }
  
  ColorizeConfig.CONFIG_SETTING = "colorConfiguration";
  