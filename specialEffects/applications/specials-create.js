import { SpecialsConfig } from "./specials-config.js"
import { easeFunctions } from "./../../module/ease.js"

export class SpecialCreate extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["form"],
      closeOnSubmit: true,
      submitOnChange: false,
      submitOnClose: false,
      popOut: true,
      editable: game.user.isGM,
      width: 320,
      height: "auto",
      template: "modules/fxmaster/specialEffects/templates/special-create.html",
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
    const eases = easeFunctions;
    const values = foundry.utils.mergeObject({
      folder: "Custom",
      angle: 0,
      position: {
        x: 0,
        y: 0
      },
      anchor: {
        x: 0.5,
        y: 0.5
      },
      scale: {
        x: 1.0,
        y: 1.0
      },
      speed: 0,
      animationDelay: {
        start: 0,
        end: 0
      },
      ease: "Linear",
      author: "",
      preset: false,
    }, this.default);

    // Return data to the template
    return {
      default: values,
      ease: Object.keys(eases)
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
    const fxs = game.settings.get("fxmaster", "specialEffects");

    const newData = {
      folder: formData["folder"],
      label: formData["label"],
      file: formData["file"],
      scale: {
        x: parseFloat(formData["scaleX"]),
        y: parseFloat(formData["scaleY"]),
      },
      angle: parseFloat(formData["angle"]),
      anchor: {
        x: formData["anchorX"],
        y: formData["anchorY"],
      },
      speed: parseFloat(formData["speed"]),
      animationDelay: {
        start: parseFloat(formData["animationDelayStart"]),
        end: parseFloat(formData["animationDelayEnd"])
      },
      ease: formData["ease"],
      preset: false,
      author: ""
    }
    const fx = fxs.filter((f) => f.label == newData.label);
    if (fx.length > 0) {
      fx[0] = foundry.utils.mergeObject(fx[0], newData)
    } else {
      fxs.push(newData)
    }
    game.settings.set("fxmaster", "specialEffects", fxs).then(() => {
      Object.values(ui.windows).forEach((w) => {
        if (w instanceof SpecialsConfig) {
          w.render(true);
        }
      })
    });
  }
}