import { MultiMaskContainer } from "./multi-mask-container.js";

// holes are broken in @pixi/smooth-graphics@0.0.17 (see https://github.com/pixijs/graphics-smooth/pull/7), so we need to use the legacy graphics in V9 and above.
const Graphics = PIXI.LegacyGraphics ?? PIXI.Graphics;

export class WeatherLayer extends CanvasLayer {
  /**
   * The weather overlay container
   * @type {MultiMaskContainer | undefined}
   */
  weather = undefined;

  /**
   * The currently active weather effects.
   * @type {Record<string, {type: string, fx: import('./effects/AbstractWeatherEffect.js').AbstractWeatherEffect}>}
   */
  weatherEffects = {};

  /**
   * The scene rectangle mask for the weather effects.
   * @type {PIXI.Graphics | undefined}
   * @private
   */
  _sceneMask = undefined;

  /**
   * The mask for weather effects defined by drawings.
   * @type {PIXI.Graphics | undefined}
   * @private
   */
  _drawingsMask = undefined;

  static get layerOptions() {
    return foundry.utils.mergeObject(super.layerOptions, {
      name: "weather",
      zIndex: 250,
    });
  }

  /**
   * Whether or not the weather effects should be masked to the scene.
   * @type {boolean}
   */
  get shouldMaskToScene() {
    return !!canvas.scene?.img;
  }

  _createInvertedMask() {
    const mask = new Graphics();
    canvas.drawings.placeables.forEach((drawing) => {
      const isMask = drawing.document.getFlag("fxmaster", "masking");
      if (!isMask) return;
      mask.beginFill(0x000000);
      const shape = drawing.shape.geometry.graphicsData[0].shape.clone();
      switch (drawing.data.type) {
        case CONST.DRAWING_TYPES.ELLIPSE: {
          shape.x = drawing.center.x;
          shape.y = drawing.center.y;
          mask.drawShape(shape);
          break;
        }
        case CONST.DRAWING_TYPES.POLYGON:
        case CONST.DRAWING_TYPES.FREEHAND: {
          const points = drawing.data.points.reduce((acc, v) => {
            acc.push(v[0] + drawing.x, v[1] + drawing.y);
            return acc;
          }, []);
          mask.drawPolygon(points);
          break;
        }
        default: {
          shape.x = drawing.x;
          shape.y = drawing.y;
          mask.drawShape(shape);
        }
      }
      mask.endFill();
    });
    return mask;
  }

  _createMask() {
    const mask = new Graphics();
    mask.beginFill(0x000000).drawShape(canvas.dimensions.rect).endFill();

    canvas.drawings.placeables.forEach((drawing) => {
      const isMask = drawing.document.getFlag("fxmaster", "masking");
      if (!isMask) return;
      mask.beginHole();
      const shape = drawing.shape.geometry.graphicsData[0].shape.clone();
      switch (drawing.data.type) {
        case CONST.DRAWING_TYPES.ELLIPSE: {
          shape.x = drawing.center.x;
          shape.y = drawing.center.y;
          mask.drawShape(shape);
          break;
        }
        case CONST.DRAWING_TYPES.POLYGON:
        case CONST.DRAWING_TYPES.FREEHAND: {
          const points = drawing.data.points.reduce((acc, v) => {
            acc.push(v[0] + drawing.x, v[1] + drawing.y);
            return acc;
          }, []);
          mask.drawPolygon(points);
          break;
        }
        default: {
          shape.x = drawing.x;
          shape.y = drawing.y;
          mask.drawShape(shape);
        }
      }
      mask.endHole();
    });
    return mask;
  }

  updateMask() {
    if (!this.weather || !canvas.scene) return;

    const otherMasks = (this.weather.multiMask ?? []).filter((mask) => mask !== this._drawingsMask);

    if (this._drawingsMask) {
      this.weather.removeChild(this._drawingsMask);
      this._drawingsMask.destroy();
      this._drawingsMask = undefined;
    }

    const invert = canvas.scene.getFlag("fxmaster", "invert");

    // Mask zones masked by drawings
    const mask = invert ? this._createInvertedMask() : this._createMask();
    this.weather.addChild(mask);
    this._drawingsMask = mask;

    Hooks.callAll("updateMask", this, this.weather, mask);
    this.weather.multiMask = [...otherMasks, mask];
  }

  /** @override */
  async tearDown() {
    Object.values(this.weatherEffects).forEach(({ fx }) => fx.stop());

    this.weather = undefined;
    this.mask = null;
    this.weatherEffects = {};
    this._sceneMask = undefined;
    this._drawingsMask = undefined;

    return super.tearDown();
  }

  /** @override */
  async draw() {
    if (this.shouldMaskToScene) {
      this._sceneMask = this._drawSceneMask();
      this.addChild(this._sceneMask);
    }

    await this.drawWeather();
    this.updateMask();
  }

  async drawWeather({ soft = false } = {}) {
    if (!canvas.scene) {
      return;
    }
    if (!this.weather) {
      const weather = new MultiMaskContainer();
      if (this._sceneMask) {
        weather.multiMask = [this._sceneMask];
      }
      this.weather = this.addChild(weather);
    }
    Hooks.callAll("drawWeather", this, this.weather, this.weatherEffects);

    const stopPromise = Promise.all(
      Object.entries(this.weatherEffects).map(async ([id, effect]) => {
        if (soft) {
          await effect.fx.fadeOut({ timeout: 20000 });
        } else {
          effect.fx.stop();
        }
        // The check is needed because a new effect might have been set already.
        if (this.weatherEffects[id] === effect) {
          delete this.weatherEffects[id];
        }
      }),
    );

    // Updating scene weather
    const flags = canvas.scene.getFlag("fxmaster", "effects") ?? {};
    for (const id in flags) {
      const options = Object.fromEntries(
        Object.entries(flags[id].options).map(([optionName, value]) => [optionName, { value }]),
      );

      this.weatherEffects[id] = {
        type: flags[id].type,
        fx: new CONFIG.fxmaster.weather[flags[id].type](this.weather, options),
      };
      this.weatherEffects[id].fx.play();
    }

    await stopPromise;
  }

  /**
   * Draw the scene mask.
   * @returns {PIXI.Graphics}
   * @private
   */
  _drawSceneMask() {
    const mask = new Graphics();
    mask.beginFill(0x000000).drawShape(canvas.dimensions.sceneRect).endFill();
    return mask;
  }

  /**
   * This used to set the layer mask in v2.0.1 But has been replaced by using a filter instead.
   * @deprecated since v2.0.2
   */
  _setLayerMask() {
    logger.warn(
      "'canvas.fxmaster._setLayerMask' doesn't actually do anything anymore and is only kept for compatibility reasons. It will be removed in a futue version. Please don't use it anymore.",
    );
  }

  /** @deprecated since v2.0.0 */
  _createInvertMask() {
    logger.warn(
      "'canvas.fxmaster._createInvertMask' is deprecated and will be removed in a future version. Please use 'canvas.fxmaster._createInvertedMask' instead.",
    );
    return this._createInvertedMask();
  }
}
