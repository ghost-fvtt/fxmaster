export class FXMasterLayer extends CanvasLayer {
  constructor() {
    super();
    this.effects = {};
    this.weather = null;
    this._controlled = {};
  }

  /* -------------------------------------------- */
  /*  Methods
    /* -------------------------------------------- */

  async draw() {
    super.draw();
  }

  /* -------------------------------------------- */

  updateMask() {
    this.visible = true;
    // Setup scene mask
    if (this.mask) this.removeChild(this.mask);
    this.mask = new PIXI.Graphics();
    this.addChild(this.mask);
    const d = canvas.dimensions;
    this.mask.beginFill(0xffffff);
    if (canvas.background.img) {
      this.mask.drawRect(
        d.paddingX - d.shiftX,
        d.paddingY - d.shiftY,
        d.sceneWidth,
        d.sceneHeight
      );
    } else {
      this.mask.drawRect(0, 0, d.width, d.height);
    }
  }

  /** @override */
  tearDown() {
    this.weather = null;
    const effKeys = Object.keys(this.effects);
    for (let i = 0; i < effKeys.length; ++i) {
      this.effects[effKeys[i]].fx.stop();
      delete this.effects[effKeys[i]];
    }
    this.visible = false;
    return super.tearDown();
  }

  drawWeather() {
    if (!this.weather) this.weather = this.addChild(new PIXI.Container());
    const effKeys = Object.keys(this.effects);
    for (let i = 0; i < effKeys.length; ++i) {
      this.effects[effKeys[i]].fx.stop();
      delete this.effects[effKeys[i]];
    }

    // Updating scene weather
    const flags = canvas.scene.getFlag('fxmaster', 'effects');
    if (flags) {
      const keys = Object.keys(flags);
      for (let i = 0; i < keys.length; ++i) {
        // Effect already exists
        if (hasProperty(this.effects, keys[i])) {
          this.effects[keys[i]].fx.play();
          continue;
        }
        this.effects[keys[i]] = {
          type: flags[keys[i]].type,
          fx: new CONFIG.weatherEffects[flags[keys[i]].type](
            this.weather
          )
        };
        this.configureEffect(keys[i]);
        this.effects[keys[i]].fx.play();
      }
    }
  }

  configureEffect(id) {
    const flags = canvas.scene.getFlag('fxmaster', 'effects');
    if (!flags || !flags[id]) return;

    // Adjust density
    if (hasProperty(flags[id], "density")) {
      let factor = (2 * flags[id].options.density) / 100;
      this.effects[id].fx.emitters.forEach(el => {
        el.frequency *= factor;
        el.maxParticles *= factor;
      });
    }

    // Adjust scale
    if (hasProperty(flags[id], "scale")) {
      factor = (2 * flags[id].options.scale) / 100;
      this.effects[id].fx.emitters.forEach(el => {
        el.startScale.value *= factor;
        let node = el.startScale.next;
        while (node) {
          node.value *= factor;
          node = node.next;
        }
      });
    }

    // Adjust speed
    if (hasProperty(flags[id], "speed")) {
      factor = (2 * flags[id].options.speed) / 100;
      this.effects[id].fx.emitters.forEach(el => {
        el.startSpeed.value *= factor;
        let node = el.startSpeed.next;
        while (node) {
          node.value *= factor;
          node = node.next;
        }
      });
    }

    // Adjust tint
    if (hasProperty(flags[id], "apply_tint")) {
      this.effects[id].fx.emitters.forEach(el => {
        let colors = hexToRGB(colorStringToHex(flags[id].options.tint));
        el.startColor.value = {
          r: colors[0] * 255,
          g: colors[1] * 255,
          b: colors[2] * 255
        };
        let node = el.startColor.next;
        while (node) {
          node.value = el.startColor.value;
          node = node.next;
        }
      });
    }

    // Adjust direction
    if (hasProperty(flags[id], "direction")) {
      factor = (360 * (flags[id].options.direction - 50)) / 100;
      this.effects[id].fx.emitters.forEach(el => {
        el.minStartRotation += factor;
        el.maxStartRotation += factor;
      });
    }
  }
}
