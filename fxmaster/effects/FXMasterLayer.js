class FXMasterLayer extends PlaceablesLayer {

  constructor() {
    super();
    this.effects = {};
  }

  /** @extends {PlaceablesLayer.layerOptions} */
  static get layerOptions() {
    return mergeObject(super.layerOptions, {
      canDragCreate: false
    });
  }

  // /** @override */
  static get dataArray() {
    return "notes";
  }

  /** @override */
  static get placeableClass() {
    return Note;
  }

  /* -------------------------------------------- */
  /*  Methods
  /* -------------------------------------------- */

  /** @extends {PlaceablesLayer.activate} */
  activate() {
    super.activate();
  }

  async draw() {
    super.draw();
  }

  /* -------------------------------------------- */

  updateMask() {
    // Setup scene mask
    if (this.mask)
      this.removeChild(this.mask);
    this.mask = new PIXI.Graphics;
    this.addChild(this.mask);
    const d = canvas.dimensions;
    this.mask.beginFill(0xFFFFFF);
    if (canvas.background.img) {
      this.mask.drawRect(d.paddingX - d.shiftX, d.paddingY - d.shiftY, d.sceneWidth, d.sceneHeight);
    } else {
      this.mask.drawRect(0, 0, d.width, d.height);
    }
  }

  drawWeather() {
    // Updating scene weather
    const flags = canvas.scene.data.flags.fxmaster;
    if (flags && flags.effects) {
      const keys = Object.keys(flags.effects);
      for (let i = 0; i < keys.length; ++i) {
        // Effect already exists  
        if (this.effects[keys[i]]) {
          continue;
        }
        this.effects[keys[i]] = {
          type: flags.effects[keys[i]].type,
          fx: new CONFIG.weatherEffects[flags.effects[keys[i]].type](canvas.fxmaster)
        };
        this.configureEffect(keys[i]);
        this.effects[keys[i]].fx.play();
      };
    }

    // Clean old effects
    const effKeys = Object.keys(this.effects);
    for (let i = 0; i < effKeys.length; ++i) {
      if (!flags.effects || !hasProperty(flags.effects, effKeys[i])) {
        this.effects[effKeys[i]].fx.stop();
        delete this.effects[effKeys[i]];
      }
    }
  }

  configureEffect(id) {
    const flags = canvas.scene.data.flags.fxmaster;
    // Adjust density
    let factor = 2 * flags.effects[id].config.density / 100;
    this.effects[id].fx.emitters.forEach(el => {
      el.frequency *= factor;
      el.maxParticles *= factor;
    });
    // Adjust scale
    factor = 2 * flags.effects[id].config.scale / 100;
    this.effects[id].fx.emitters.forEach(el => {
      el.startScale.value *= factor;
      let node = el.startScale.next;
      while (node) {
        node.value *= factor;
        node = node.next;
      }
    });

    // Adjust speed
    factor = 2 * flags.effects[id].config.speed / 100;
    this.effects[id].fx.emitters.forEach(el => {
      el.startSpeed.value *= factor;
      let node = el.startSpeed.next;
      while (node) {
        node.value *= factor;
        node = node.next;
      }
    });

    // Adjust tint
    if (flags.effects[id].config.apply_tint) {
      this.effects[id].fx.emitters.forEach(el => {
        let colors = hexToRGB(colorStringToHex(flags.effects[id].config.tint));
        el.startColor.value = { r: colors[0] * 255, g: colors[1] * 255, b: colors[2] * 255 };
        let node = el.startColor.next;
        while (node) {
          node.value = el.startColor.value;
          node = node.next;
        }
      });
    }

    // Adjust direction
    factor = 360 * (flags.effects[id].config.direction - 50) / 100;
    this.effects[id].fx.emitters.forEach(el => {
      el.minStartRotation += factor;
      el.maxStartRotation += factor;
    });
  }

  /* -------------------------------------------- */

  /** @extends {PlaceablesLayer.deactivate} */
  deactivate() {
    super.deactivate();
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /** @override */
  _onMouseDown(event) { }

  /* -------------------------------------------- */

  /**
   * Handle JournalEntry entity drop data
   * @param {Event} event
   * @param {JournalEntry} entry
   * @private
   */
  _onDropEntity(event, entry) {
  }
}