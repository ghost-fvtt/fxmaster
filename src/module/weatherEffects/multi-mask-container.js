/**
 * A {@link PIXI.Container} that supports setting multiple masks via the `multiMask` property.
 *
 * @remarks
 * `multiMask` is not factored into bounds calculation when using this as a child of another {@link MultiMaskContainer}
 * or {@link PIXI.Container}.
 */
export class MultiMaskContainer extends PIXI.Container {
  /**
   * The original, cached masks of the object.
   *
   * @type {ReadonlyArray<PIXI.Container | PIXI.MaskData> | null}
   * @protected
   */
  _multiMask = null;

  /**
   * The multiple masks to be used for this container.
   * @type {ReadonlyArray<PIXI.Container | PIXI.MaskData> | null}
   */
  get multiMask() {
    return this._multiMask;
  }

  /**
   * The multiple masks to be used for this container.
   * @type {ReadonlyArray<PIXI.Container | PIXI.MaskData> | null}
   */
  set multiMask(value) {
    if (this._multiMask === value) {
      return;
    }

    for (const mask of this._multiMask ?? []) {
      const maskObject = mask.maskObject ?? mask;

      maskObject._maskRefCount--;

      if (maskObject._maskRefCount === 0) {
        maskObject.renderable = true;
        maskObject.isMask = false;
      }
    }

    this._multiMask = value;

    for (const mask of this._multiMask ?? []) {
      const maskObject = mask.maskObject ?? mask;

      if (maskObject._maskRefCount === 0) {
        maskObject.renderable = false;
        maskObject.isMask = true;
      }

      maskObject._maskRefCount++;
    }
  }

  /** @override */
  render(renderer) {
    if (!this.visible || this.worldAlpha <= 0 || !this.renderable) {
      return;
    }

    if (this._multiMask?.length > 0) {
      this.renderAdvanced(renderer);
    } else {
      super.render(renderer);
    }
  }

  /**
   * Render the object using the WebGL renderer and advanced features.
   * Incorporated and slightly adjusted from https://github.com/pixijs/pixijs/tree/dev/packages/display
   * @license MIT
   * @override
   */
  renderAdvanced(renderer) {
    const filters = this.filters;
    const mask = this._mask;
    const multiMask = this._multiMask;

    // push filter first as we need to ensure the stencil buffer is correct for any masking
    if (filters) {
      if (!this._enabledFilters) {
        this._enabledFilters = [];
      }

      this._enabledFilters.length = 0;

      for (let i = 0; i < filters.length; i++) {
        if (filters[i].enabled) {
          this._enabledFilters.push(filters[i]);
        }
      }
    }

    const flush =
      (filters && this._enabledFilters && this._enabledFilters.length) ||
      (mask && (!mask.isMaskData || (mask.enabled && (mask.autoDetect || mask.type !== PIXI.MASK_TYPES.NONE)))) ||
      multiMask?.some(
        (mask) => !mask.isMaskData || (mask.enabled && (mask.autoDetect || mask.type !== PIXI.MASK_TYPES.NONE)),
      );

    if (flush) {
      renderer.batch.flush();
    }

    if (filters && this._enabledFilters && this._enabledFilters.length) {
      renderer.filter.push(this, this._enabledFilters);
    }

    if (mask) {
      renderer.mask.push(this, this._mask);
    }

    if (multiMask?.length > 0) {
      multiMask.forEach((mask) => renderer.mask.push(this, mask));
    }

    // add this object to the batch, only rendered if it has a texture.
    this._render(renderer);

    // now loop through the children and make sure they get rendered
    for (let i = 0, j = this.children.length; i < j; i++) {
      this.children[i].render(renderer);
    }

    if (flush) {
      renderer.batch.flush();
    }

    if (multiMask?.length > 0) {
      multiMask.forEach(() => renderer.mask.pop(this));
    }

    if (mask) {
      renderer.mask.pop(this);
    }

    if (filters && this._enabledFilters && this._enabledFilters.length) {
      renderer.filter.pop();
    }
  }
}
