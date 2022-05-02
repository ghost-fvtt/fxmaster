import "../../../css/filters-config.css";

import { packageId } from "../../constants.js";
import { FXMasterBaseForm } from "../../base-form.js";
import { resetFlag } from "../../utils.js";

export class FilterEffectsManagementConfig extends FXMasterBaseForm {
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
      template: "modules/fxmaster/templates/filter-effects-management.hbs",
      id: "filters-config",
      title: game.i18n.localize("FXMASTER.FilterEffectsManagementTitle"),
    });
  }

  /** @override */
  getData() {
    const currentFilters = canvas.scene?.getFlag(packageId, "filters") ?? {};
    const activeFilters = Object.fromEntries(
      Object.values(currentFilters).map((filter) => [filter.type, filter.options]),
    );

    const filters = Object.fromEntries(
      Object.entries(CONFIG.fxmaster.filterEffects).sort(([, clsA], [, clsB]) => clsA.label.localeCompare(clsB.label)),
    );

    return {
      filters,
      activeFilters,
    };
  }

  /** @override */
  async _updateObject(_, formData) {
    if (!canvas.scene) {
      return;
    }
    const filtersDB = CONFIG.fxmaster.filterEffects;

    const filters = Object.fromEntries(
      Object.entries(filtersDB)
        .filter(([type]) => !!formData[type])
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

    resetFlag(canvas.scene, "filters", filters);
  }
}
