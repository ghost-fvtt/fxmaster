import "../../../css/filters-config.css";

import { packageId } from "../../constants.js";
import { FXMasterBaseForm } from "../../base-form.js";
import { resetFlags } from "../../utils.js";

export class FiltersConfig extends FXMasterBaseForm {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["form", "fxmaster", "filters", "sidebar-popout"],
      closeOnSubmit: false,
      submitOnChange: false,
      submitOnClose: false,
      popOut: true,
      editable: game.user.isGM,
      width: 300,
      height: "auto",
      template: "modules/fxmaster/templates/filters-config.hbs",
      id: "filters-config",
      title: game.i18n.localize("FXMASTER.FiltersConfigTitle"),
    });
  }

  /** @override */
  getData() {
    const currentFilters = canvas.scene?.getFlag(packageId, "filters") ?? {};
    const activeFilters = Object.fromEntries(
      Object.values(currentFilters).map((filter) => [filter.type, filter.options]),
    );

    const filteredLayers = canvas.scene?.getFlag(packageId, "filteredLayers") ?? {
      background: true,
      foreground: true,
      tokens: true,
      drawings: true,
    };

    const filters = Object.fromEntries(
      Object.entries(CONFIG.fxmaster.filters).sort(([, clsA], [, clsB]) => clsA.label.localeCompare(clsB.label)),
    );

    return {
      filters,
      activeFilters,
      filteredLayers,
    };
  }

  /** @override */
  async _updateObject(_, formData) {
    if (!canvas.scene) {
      return;
    }
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

    await canvas.scene.setFlag(packageId, "filteredLayers", filteredLayers);
    resetFlags(canvas.scene, "filters", filters);
  }
}
