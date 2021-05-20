import { SpecialCreate } from "./specials-create.js"

export class SpecialsConfig extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["fxmaster", "sidebar-popout"],
      closeOnSubmit: true,
      submitOnChange: false,
      submitOnClose: false,
      popOut: true,
      editable: game.user.isGM,
      width: 120,
      height: 200,
      resizable: true,
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
    const custom = {
      label: "Custom",
      editable: true,
      effects: game.settings.get('fxmaster', 'specialEffects')
    }
    CONFIG.fxmaster.specials.custom = custom
    return {
      folders: CONFIG.fxmaster.specials,
    };
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    html.find('.special-effects .description').click(event => {
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
      settings.splice(effectId, 1);
      game.settings.set("fxmaster", "specialEffects", settings).then(() => {
        this.render(true);
      });
    })

    html.find(".edit-effect").click((ev) => {
      const effectId = ev.currentTarget.closest(".special-effects").dataset["effectId"];
      let settings = game.settings.get("fxmaster", "specialEffects");
      const d = new SpecialCreate();
      d.setDefault(settings[0][effectId]);
      d.render(true);
    })

    html.find(".sync-effects").click(ev => {
      this.render(true);
    })

    const directory = html.find(".directory-list");
    directory.on("click", ".folder-header", this._toggleFolder.bind(this));

  }

  _toggleFolder(event) {
    let folder = $(event.currentTarget.parentElement);
    let collapsed = folder.hasClass("collapsed");

    // Expand
    if ( collapsed ) folder.removeClass("collapsed");

    // Collapse
    else {
      folder.addClass("collapsed");
      const subs = folder.find('.folder').addClass("collapsed");
    }
  }
}
