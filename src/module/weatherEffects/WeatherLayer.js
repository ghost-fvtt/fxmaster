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

  static get layerOptions() {
    return foundry.utils.mergeObject(super.layerOptions, {
      name: "weather",
      zIndex: 250,
    });
  }

  /* -------------------------------------------- */
  _createInvertedMask() {
    const mask = new PIXI.Graphics();
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
    const mask = new PIXI.Graphics();
    const sceneShape = canvas.scene.img ? canvas.dimensions.sceneRect.clone() : canvas.dimensions.rect.clone();
    mask.beginFill(0x000000).drawShape(sceneShape).endFill();

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
    this.visible = true;
    if (!this.weather) return;

    if (this.weather.mask) {
      this.weather.removeChild(this.weather.mask);
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

    if (this.weather) {
      this.removeChild(this.weather);
      this.weather = null;
    }
    this.weatherEffects = {};
    this.visible = false;
    return super.tearDown();
  }

  async drawWeather({ soft = false } = {}) {
    if (!this.weather) {
      this.weather = this.addChild(new PIXI.Container());
    }
    Hooks.callAll("drawWeather", this, this.weather, this.weatherEffects);

    Object.entries(this.weatherEffects).forEach(async ([id, effect]) => {
      if (soft) {
        await effect.fx.fadeOut({ timeout: 20000 });
      } else {
        effect.fx.stop();
      }
      // The check is needed because a new effect might have been set already.
      if (this.weatherEffects[id] === effect) {
        delete this.weatherEffects[id];
      }
    });

    // Updating scene weather
    const flags = canvas.scene.getFlag("fxmaster", "effects") ?? {};
    for (const id in flags) {
      this.weatherEffects[id] = {
        type: flags[id].type,
        fx: new CONFIG.fxmaster.weather[flags[id].type](this.weather),
      };
      this.configureEffect(id);
      this.weatherEffects[id].fx.play();
    }
  }

  configureEffect(id) {
    const flags = canvas.scene.getFlag("fxmaster", "effects") ?? {};
    if (!flags[id]) return;
    Object.entries(flags[id].options).forEach(([key, val]) => {
      const effectClass = CONFIG.fxmaster.weather[flags[id].type];
      const method = effectClass.parameters[key].callback;
      this.weatherEffects[id].fx[method](val);
    });
  }
}
