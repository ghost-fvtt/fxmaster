import { SpecialCreate } from "./specials-create.js"

export class SpecialsConfig extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["fxmaster", "specials", "sidebar-popout"],
      closeOnSubmit: true,
      submitOnChange: false,
      submitOnClose: false,
      popOut: true,
      editable: game.user.isGM,
      width: 120,
      height: 200,
      resizable: true,
      dragDrop: [{ dragSelector: ".special-effects" }],
      template: "modules/fxmaster/specialEffects/templates/specials-config.html",
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
    return {
      folders: CONFIG.fxmaster.userSpecials,
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
    html.find("a[data-action=add-effect]").click(async (event) => {
      new SpecialCreate().render(true);
    })

    html.find(".preview video").hover(ev => {
      ev.currentTarget.play();
    })

    html.find(".del-effect").click((ev) => {
      const folderId = ev.currentTarget.closest(".folder").dataset["folderId"];
      const effectId = ev.currentTarget.closest(".special-effects").dataset["effectId"];
      const data = CONFIG.fxmaster.userSpecials[folderId].effects[effectId];
      const settings = game.settings.get("fxmaster", "specialEffects");
      const id = settings.findIndex((v) => { return v.label === data.label && v.folder === data.folder });
      if (id === -1) {
        return;
      }
      settings.splice(id, 1);
      game.settings.set("fxmaster", "specialEffects", settings).then(() => {
        this.render(true);
      });
    })

    html.find(".edit-effect").click((ev) => {
      const folderId = ev.currentTarget.closest(".folder").dataset["folderId"];
      const effectId = ev.currentTarget.closest(".special-effects").dataset["effectId"];
      const d = new SpecialCreate();
      d.setDefault(CONFIG.fxmaster.userSpecials[folderId].effects[effectId]);
      d.render(true);
    })

    html.find(".action-toggle").click(ev => {
      for (const c of ev.currentTarget.parentElement.children) {
        c.classList.remove("active");
      }
      ev.currentTarget.classList.add("active");
    });

    const directory = html.find(".directory-list");
    directory.on("click", ".folder-header", this._toggleFolder.bind(this));

  }

  _toggleFolder(event) {
    let folder = $(event.currentTarget.parentElement);
    let collapsed = folder.hasClass("collapsed");

    // Expand
    if (collapsed) folder.removeClass("collapsed");

    // Collapse
    else {
      folder.addClass("collapsed");
      const subs = folder.find('.folder').addClass("collapsed");
    }
  }

  _onDragStart(event) {
    const effectId = event.currentTarget.closest(".special-effects").dataset.effectId;
    const folderId = event.currentTarget.closest(".folder").dataset.folderId;
    const effectData = CONFIG.fxmaster.userSpecials[folderId].effects[effectId];
    effectData.type = "SpecialEffect";
    event.dataTransfer.setData("text/plain", JSON.stringify(effectData));
  }
}
