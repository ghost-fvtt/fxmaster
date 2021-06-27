export const registerHelpers = function () {
    Handlebars.registerHelper("parameter", (effect, param, key, options = {}) => { 
        let deflt = effect.default[key];
        if (options[key] !== undefined) {
            deflt = options[key]
        };
        switch (param.type) {
            case "color":
                return `<input type="checkbox" name="${effect.label}_${key}_apply" ${deflt.apply ? "checked" : ""}/><input type="color" name="${effect.label}_${key}" value="${deflt.value}">`;
            case "range":
                return `
              <input type="range" step="${param.step}" min="${param.min}" max="${param.max}" name="${effect.label}_${key}" value="${deflt}">
              <span class="range-value">${deflt}</span>
              `;
            case "number":
                return `
              <input type="text" data-dtype="Number" name="${effect.label}_${key}" value="${deflt}">
              `;
        }
        return "";
    });
}