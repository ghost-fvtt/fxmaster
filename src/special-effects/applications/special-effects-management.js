import { SpecialEffectConfig } from "./special-effect-config.js";
import { packageId } from "../../constants.js";

import "../../../css/specials-config.css";

export class SpecialEffectsManagement extends Application {
  /** @override */
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
      template: "modules/fxmaster/templates/special-effects-management.hbs",
      id: "specials-config",
      title: game.i18n.localize("FXMASTER.SpecialEffectsManagementTitle"),
    });
  }

  /** @override */
  getData() {
    if(foundry.utils.isNewerVersion(game.version, "13.0.0")) {
      const folders = Object.entries(CONFIG.fxmaster.userSpecials).map(
        ([id, folder]) => ({ id, label: folder.label, effects: folder.effects })
      );
      return { folders };
    }
    else {
      return {
        folders: CONFIG.fxmaster.userSpecials,
      };
    }
  }

  /** @override */
  activateListeners(html) {
    html.find(".special-effects .description").click((event) => {
      let list = event.currentTarget.closest(".directory-list");
      let items = $(list).find(".directory-item");
      for (let i = 0; i < items.length; i++) {
        items[i].classList.remove("active");
      }
      event.currentTarget.parentElement.classList.add("active");
    });

    // Dialog
    html.find("a[data-action=add-effect]").click(async () => {
      new SpecialEffectConfig().render(true);
    });

    html.find(".preview video").hover((ev) => {
      ev.currentTarget.play();
    });

    html.find(".del-effect").click((ev) => {
      const folderId = ev.currentTarget.closest(".folder").dataset["folderId"];
      const effectId = ev.currentTarget.closest(".special-effects").dataset["effectId"];
      const data = CONFIG.fxmaster.userSpecials[folderId].effects[effectId];
      const settings = game.settings.get(packageId, "specialEffects");
      const id = settings.findIndex((v) => {
        return v.label === data.label && v.folder === data.folder;
      });
      if (id === -1) {
        return;
      }
      settings.splice(id, 1);
      game.settings.set(packageId, "specialEffects", settings);
    });

    html.find(".edit-effect").click((ev) => {
      const folderId = ev.currentTarget.closest(".folder").dataset["folderId"];
      const effectId = ev.currentTarget.closest(".special-effects").dataset["effectId"];
      const d = new SpecialEffectConfig();
      d.setDefault(CONFIG.fxmaster.userSpecials[folderId].effects[effectId]);
      d.render(true);
    });

    html.find(".action-toggle").click((ev) => {
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
      folder.find(".folder").addClass("collapsed");
    }
  }

  /** @override */
  _onDragStart(event) {
    const effectId = event.currentTarget.closest(".special-effects").dataset.effectId;
    const folderId = event.currentTarget.closest(".folder").dataset.folderId;
    const effectData = CONFIG.fxmaster.userSpecials[folderId].effects[effectId];
    effectData.type = "SpecialEffect";
    event.dataTransfer.setData("text/plain", JSON.stringify(effectData));
  }
}
