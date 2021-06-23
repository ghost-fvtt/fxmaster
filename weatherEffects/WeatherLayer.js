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

  updateMask() {
    this.visible = true;
    if (!this.weather) return;

    // Mask zones masked by drawings
    const mask = new PIXI.Graphics();
    this.weather.addChild(mask);

    if (this.weather.mask) {
      this.weather.removeChild(this.weather.mask);
      this.weather.mask = null;
    }

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
    
    const effKeys = Object.keys(this.weatherEffects);
    for (let i = 0; i < effKeys.length; ++i) {
      if (options.soft === true) {
        for (let ef of this.weatherEffects[effKeys[i]].fx.emitters) {
          ef.emitterLifetime = 0.1;
          ef.playOnceAndDestroy(() => {
            delete this.weatherEffects[effKeys[i]];
          });
        }
      } else {
        this.weatherEffects[effKeys[i]].fx.stop();
        delete this.weatherEffects[effKeys[i]];
      }
    }

    // Updating scene weather
    const flags = canvas.scene.getFlag("fxmaster", "effects");
    if (flags) {
      const keys = Object.keys(flags);
      for (let i = 0; i < keys.length; ++i) {
        this.weatherEffects[keys[i]] = {
          type: flags[keys[i]].type,
          fx: new CONFIG.weatherEffects[flags[keys[i]].type](this.weather),
        };
        this.configureEffect(keys[i]);
        this.weatherEffects[keys[i]].fx.play();
      }
    }
  }

  configureEffect(id) {
    const flags = canvas.scene.getFlag("fxmaster", "effects");
    if (!flags || !flags[id]) return;

    // Adjust density
    if (hasProperty(flags[id], "options.density")) {
      let factor = (2 * flags[id].options.density) / 100;
      this.weatherEffects[id].fx.emitters.forEach((el) => {
        el.frequency *= factor;
        el.maxParticles *= factor;
      });
    }

    // Adjust scale
    if (hasProperty(flags[id], "options.scale")) {
      let factor = (2 * flags[id].options.scale) / 100;
      this.weatherEffects[id].fx.emitters.forEach((el) => {
        el.startScale.value *= factor;
        let node = el.startScale.next;
        while (node) {
          node.value *= factor;
          node = node.next;
        }
      });
    }

    // Adjust speed
    if (hasProperty(flags[id], "options.speed")) {
      let factor = (2 * flags[id].options.speed) / 100;
      this.weatherEffects[id].fx.emitters.forEach((el) => {
        el.startSpeed.value *= factor;
        let node = el.startSpeed.next;
        while (node) {
          node.value *= factor;
          node = node.next;
        }
      });
    }

    // Adjust tint
    if (
      hasProperty(flags[id], "options.apply_tint") &&
      flags[id].options.apply_tint == true
    ) {
      this.weatherEffects[id].fx.emitters.forEach((el) => {
        let colors = hexToRGB(colorStringToHex(flags[id].options.tint));
        el.startColor.value = {
          r: colors[0] * 255,
          g: colors[1] * 255,
          b: colors[2] * 255,
        };
        let node = el.startColor.next;
        while (node) {
          node.value = el.startColor.value;
          node = node.next;
        }
      });
    }

    // Adjust direction
    if (hasProperty(flags[id], "options.direction")) {
      let factor = (360 * (flags[id].options.direction - 50)) / 100;
      this.weatherEffects[id].fx.emitters.forEach((el) => {
        el.minStartRotation += factor;
        el.maxStartRotation += factor;
      });
    }
  }
}
