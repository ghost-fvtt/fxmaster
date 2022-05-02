export function registerHandlebarsHelpers() {
  Handlebars.registerHelper("fxmasterParameter", (effectCls, parameterConfig, parameterName, options = {}) => {
    const _default = options[parameterName] ?? effectCls.default[parameterName];

    switch (parameterConfig.type) {
      case "color":
        return `
              <input type="checkbox" name="${effectCls.label}_${parameterName}_apply" ${
          _default.apply ? "checked" : ""
        }/>
              <input type="color" name="${effectCls.label}_${parameterName}" value="${_default.value}">
              `;
      case "range":
        return `
              <input class="fxmaster-range-input" type="range" step="${parameterConfig.step}" min="${parameterConfig.min}" max="${parameterConfig.max}" name="${effectCls.label}_${parameterName}" value="${_default}">
              <span class="range-value">${_default}</span>
              `;
      case "number":
        return `
              <input class="fxmaster-text-input" type="text" data-dtype="Number" name="${effectCls.label}_${parameterName}" value="${_default}">
              `;
      case "multi-select":
        return `<select class="fxmaster-multi-select" multiple name="${
          effectCls.label
        }_${parameterName}">${Object.entries(parameterConfig.options).map(
          ([key, name]) =>
            `<option class="fxmaster-multi-select__option" value="${key}"${
              _default.includes(key) ? " selected" : ""
            }>${game.i18n.localize(name)}</option>`,
        )}</select>`;
    }
    return "";
  });
}
