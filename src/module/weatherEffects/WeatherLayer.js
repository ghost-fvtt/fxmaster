import { executeWhenWorldIsMigratedToLatest, isOnTargetMigration } from "../migration.js";
import { intersectRectangles } from "../pixi-helpers.js";

// holes are broken in @pixi/smooth-graphics@0.0.17 (see https://github.com/pixijs/graphics-smooth/pull/7), so we need to use the legacy graphics in V9 and above.
const Graphics = PIXI.LegacyGraphics ?? PIXI.Graphics;

export class WeatherLayer extends CanvasLayer {
  /**
   * The weather overlay container
   * @type {PIXI.Container | undefined}
   */
  weather = undefined;

  /**
   * The currently active weather effects.
   * @type {Record<string, {type: string, fx: import('./effects/AbstractWeatherEffect.js').AbstractWeatherEffect}>}
   */
  weatherEffects = {};

  /**
   * The scene mask.
   * @type {CachedContainer | undefined}
   * @private
   */
  _sceneMask = undefined;

  /**
   * The filter used to apply the scene mask.
   * @type {InverseOcclusionMaskFilter | undefined}
   * @private
   */
  _sceneMaskFilter = undefined;

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

    if (this.weather.mask) {
      this.weather.removeChild(this.weather.mask);
      this.weather.mask.destroy();
      this.weather.mask = null;
    }
    const invert = canvas.scene.getFlag("fxmaster", "invert");

    // Mask zones masked by drawings
    const mask = invert ? this._createInvertedMask() : this._createMask();
    this.weather.addChild(mask);

    Hooks.callAll("updateMask", this, this.weather, mask);
    this.weather.mask = mask;
  }

  /** @override */
  async tearDown() {
    Object.values(this.weatherEffects).forEach(({ fx }) => fx.stop());

    this.weather = undefined;
    this.mask = null;
    this.weatherEffects = {};
    this._sceneMask?.destroy();
    this._sceneMask = undefined;
    this._sceneMaskFilter = undefined;

    return super.tearDown();
  }

  /** @override */
  async draw() {
    if (!game.settings.get("fxmaster", "enable") || game.settings.get("fxmaster", "disableAll")) {
      return;
    }
    if (!isOnTargetMigration()) {
      // If migrations need to be performed, defer drawing to when they are done.
      executeWhenWorldIsMigratedToLatest(this.draw.bind(this));
      return;
    }

    if (this.shouldMaskToScene) {
      this._sceneMask = this._drawSceneMask();
      this.addChild(this._sceneMask);
      this._sceneMaskFilter = this._createSceneMaskFilter();
    }

    await this.drawWeather();
    this.updateMask();
  }

  async drawWeather({ soft = false } = {}) {
    if (!canvas.scene) {
      return;
    }
    if (!this.weather) {
      this.weather = this.addChild(new PIXI.Container());
      if (this._sceneMaskFilter) {
        this.weather.filters = [this._sceneMaskFilter];
      }
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
   * @returns {CachedContainer}
   * @private
   */
  _drawSceneMask() {
    const cachedContainer = new CachedContainer();
    const mask = new Graphics()
      .beginFill(0xffffff)
      .drawShape(canvas.dimensions.rect)
      .endFill()
      .beginHole()
      .drawShape(intersectRectangles(canvas.dimensions.sceneRect, canvas.dimensions.rect))
      .endHole();
    cachedContainer.addChild(mask);
    return cachedContainer;
  }

  /**
   * Create the filter for applying the scene mask.
   * @returns {InverseOcclusionMaskFilter | undefined} The filter for applying the scene mask or undefined if it doesn't exist
   * @private
   */
  _createSceneMaskFilter() {
    if (!this._sceneMask) {
      return undefined;
    }
    const sceneMaskFilter = InverseOcclusionMaskFilter.create(
      {
        alphaOcclusion: 0,
        uMaskSampler: this._sceneMask.renderTexture,
      },
      "b",
    );
    sceneMaskFilter.enabled = true;
    return sceneMaskFilter;
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
