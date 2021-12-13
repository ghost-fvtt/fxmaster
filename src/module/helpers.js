export const registerHelpers = function () {
  Handlebars.registerHelper("parameter", (effectCls, parameterConfig, parameterName, options = {}) => {
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
              <input type="range" step="${parameterConfig.step}" min="${parameterConfig.min}" max="${parameterConfig.max}" name="${effectCls.label}_${parameterName}" value="${_default}">
              <span class="range-value">${_default}</span>
              `;
      case "number":
        return `
              <input type="text" data-dtype="Number" name="${effectCls.label}_${parameterName}" value="${_default}">
              `;
    }
    return "";
  });
};
