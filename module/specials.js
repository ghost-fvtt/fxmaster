import { FXMASTER } from "./config.js"
import {SpecialCreate} from "./specials-create.js"

export class SpecialsConfig extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["fxmaster", "sidebar-popout"],
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
      effects: game.settings.get("fxmaster", "specialEffects")[0],
    };
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    html.find('.special-effects h4').click(event => {
      let list = event.currentTarget.closest('.directory-list');
      let items = $(list).find('.directory-item');
      for (let i = 0; i < items.length; i++) {
        items[i].classList.remove('active');
      }
      event.currentTarget.parentElement.classList.add('active');
    });

    // Dialog
    html.find(".add-effect").click(async (event) => {
      new SpecialCreate().render(true);
    })

    html.find(".preview video").hover(ev => {
      ev.currentTarget.play();
    })

    html.find(".del-effect").click((ev) => {
      const effectId = ev.currentTarget.closest(".special-effects").dataset["effectId"];
      let settings = game.settings.get("fxmaster", "specialEffects");
      settings[0].splice(effectId, 1);
      game.settings.set("fxmaster", "specialEffects", settings[0]).then(() => {
        this.render(true);
      });
    })
  }

  /**
   * This method is called upon form submission after form data is validated
   * @param event {Event}       The initial triggering submission event
   * @param formData {Object}   The object of validated form data with which to update the object
   * @private
   */
  _updateObject(_, formData) { }
}
