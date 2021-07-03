export class WeatherLayer extends CanvasLayer {
  constructor() {
    super();
    this.weatherEffects = {};
    this.weather = null;
    this.options = this.constructor.layerOptions;
  }

  static get layerOptions() {
    return foundry.utils.mergeObject(super.layerOptions, {
      name: "weather",
      zIndex: 250,
    });
  }

  /* -------------------------------------------- */
  _createInvertMask() {
    const mask = new PIXI.Graphics();
    canvas.drawings.placeables.forEach((drawing) => {
      const isMask = drawing.document.getFlag("fxmaster", "masking");
      if (!isMask) return;
      mask.beginFill(0x000000);
      const shape = drawing.shape.geometry.graphicsData[0].shape.clone();
      switch (drawing.data.type) {
        case CONST.DRAWING_TYPES.ELLIPSE:
          shape.x = drawing.center.x;
          shape.y = drawing.center.y;
          mask.drawShape(shape);
          break;
        case CONST.DRAWING_TYPES.POLYGON:
        case CONST.DRAWING_TYPES.FREEHAND:
          const points = drawing.data.points.reduce((acc, v) => {
            acc.push(v[0] + drawing.x, v[1] + drawing.y);
            return acc;
          }, [])
          mask.drawPolygon(points);
          break;
        default:
          shape.x = drawing.x;
          shape.y = drawing.y;
          mask.drawShape(shape);
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
        case CONST.DRAWING_TYPES.ELLIPSE:
          shape.x = drawing.center.x;
          shape.y = drawing.center.y;
          mask.drawShape(shape);
          break;
        case CONST.DRAWING_TYPES.POLYGON:
        case CONST.DRAWING_TYPES.FREEHAND:
          const points = drawing.data.points.reduce((acc, v) => {
            acc.push(v[0] + drawing.x, v[1] + drawing.y);
            return acc;
          }, [])
          mask.drawPolygon(points);
          break;
        default:
          shape.x = drawing.x;
          shape.y = drawing.y;
          mask.drawShape(shape);
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
    const mask = invert ? this._createInvertMask() : this._createMask();
    this.weather.addChild(mask);

    Hooks.callAll("updateMask", this, this.weather, mask);
    this.weather.mask = mask;
  }

  /** @override */
  async tearDown() {
    const effKeys = Object.keys(this.weatherEffects);
    for (let i = 0; i < effKeys.length; ++i) {
      this.weatherEffects[effKeys[i]].fx.stop();
    }
    if (this.weather) {
      this.removeChild(this.weather);
      this.weather = null;
    }
    this.weatherEffects = {};
    this.visible = false;
    return super.tearDown();
  }

  async drawWeather(options = {}) {
    if (!this.weather) {
      this.weather = this.addChild(new PIXI.Container());
    }
    Hooks.callAll("drawWeather", this, this.weather, this.weatherEffects);

    for (const key in this.weatherEffects) {
      if (options.soft === true) {
        for (const ef of this.weatherEffects[key].fx.emitters) {
          ef.emitterLifetime = 0.1;
          ef.playOnceAndDestroy(() => {
            if (this.weatherEffects[key]) {
              delete this.weatherEffects[key];
            }
          });
          setTimeout(() => {
            if (this.weatherEffects[key]) {
              this.weatherEffects[key].fx.stop();
              delete this.weatherEffects[key];
            }
          }, 20000);
        }
      } else {
        this.weatherEffects[key].fx.stop();
        delete this.weatherEffects[key];
      }
    }

    // Updating scene weather
    const flags = canvas.scene.getFlag("fxmaster", "effects");
    for (const key in flags) {
      this.weatherEffects[key] = {
        type: flags[key].type,
        fx: new CONFIG.fxmaster.weather[flags[key].type](this.weather),
      };
      this.configureEffect(key);
      this.weatherEffects[key].fx.play();
    }
  }

  configureEffect(id) {
    const flags = canvas.scene.getFlag("fxmaster", "effects") || {};
    if (!flags[id]) return;
    Object.entries(flags[id].options).forEach(([key, val]) => {
      const effectClass = CONFIG.fxmaster.weather[flags[id].type];
      const method = effectClass.parameters[key].callback;
      this.weatherEffects[id].fx[method](val);
    });
  }

  /*
  ** Migration
  ** TODO: Remove next version
  */
  playVideo(...args) {
    console.warn("DEPRECATED: canvas.fxmaster.playVideo will be removed soon. Please use canvas.specials.playVideo");
    canvas.specials.playVideo(...args);
  }
}
