/**
 * An abstract FormApplication that handles functionality common to multiple FXMaster forms.
 * In particular, it provides the following functionality:
 * * Handling of collapsible elements
 * * Making slider changes for range inputs update the accompanying text box immediately
 * * Handling the disabled state of the submission button
 *
 * @extends FormApplication
 * @abstract
 * @interface
 *
 * @param {Object} object                     Some object which is the target data structure to be be updated by the form.
 * @param {FormApplicationOptions} [options]  Additional options which modify the rendering of the sheet.
 */
export class FXMasterBaseForm extends FormApplication {
  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html
      .find(".fxmaster-groups-list__collapse")
      .click((event) =>
        this._onClickCollapse(
          event,
          "fxmaster-groups-list__item",
          "fxmaster-groups-list__collapsible",
          "fxmaster-groups-list__collapse-icon",
        ),
      );
    html
      .find(".fxmaster-list__collapse")
      .click((event) =>
        this._onClickCollapse(
          event,
          "fxmaster-list__item",
          "fxmaster-list__collapsible",
          "fxmaster-list__collapse-icon",
        ),
      );
    html.find(".fxmaster-range-input").on("input", this._onChangeRange.bind(this));
  }

  /**
   * Handle toggling a a collapsible. To collapse the collapsible, the class `${collapsibleClass}--collapsed` is
   * added to it.
   *
   * @param {JQuery.ClickEvent} event            The originating click event
   * @param {string}            parentClass      The CSS class for selecting the parent that contains both the collapse
   *                                             "button" and the collapsible
   * @param {string}            collapsibleClass The CSS class for selecting the collapsible inside the parent
   * @param {string}            [iconClass]      An optional CSS class to select an up/down arrow icon to be toggled
   * @private
   */
  _onClickCollapse(event, parentClass, collapsibleClass, iconClass) {
    const parentItem = $(event.currentTarget).parents(`.${parentClass}`);
    const collapsible = parentItem.children(`.${collapsibleClass}`);
    const icon = iconClass !== undefined ? parentItem.find(`.${iconClass}`) : undefined;
    this._collapse(collapsible[0], icon);
  }

  /**
   * Toggle the collapsed state of an element.
   * @param {HTMLElement} collapsible                 The element to collapse
   * @param {JQuery|null} [icon]                      An up/down arrow icon to be toggled
   * @param {number}      [speed=250]                 The speed for sliding the element in and out, in milliseconds
   * @private
   */
  _collapse(collapsible, icon) {
    const shouldCollapse = collapsible.getAttribute("aria-hidden") !== "true";

    if (shouldCollapse) {
      collapsible.setAttribute("aria-hidden", "true");
      icon?.removeClass("fa-angle-down").addClass("fa-angle-up");
    } else {
      collapsible.removeAttribute("aria-hidden");
      icon?.removeClass("fa-angle-up").addClass("fa-angle-down");
    }
  }

  /** @override */
  async _onChangeInput(...args) {
    this.element.find('button[type="submit"]').prop("disabled", false);
    return super._onChangeInput(...args);
  }

  /** @override */
  async _onSubmit(...args) {
    this.element.find('button[type="submit"]').prop("disabled", true);
    return super._onSubmit(...args);
  }
}
