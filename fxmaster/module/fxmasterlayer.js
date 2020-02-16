class FXMasterLayer extends PlaceablesLayer {

  /** @extends {PlaceablesLayer.layerOptions} */
  static get layerOptions() {
    return mergeObject(super.layerOptions, {
      canDragCreate: false
    });
  }

  /** @override */
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

  /* -------------------------------------------- */

  async draw() {
    // Draw the weather layer
    this.drawWeather();
  }

  /* -------------------------------------------- */

  drawWeather() {
    if (!this.weather) this.weather = this.addChild(new PIXI.Container());
    const flags = canvas.scene.data.flags.fxmaster;
    let ids = [];
    if (!this.effects) this.effects = {};
    if (flags && flags.effects) {
      Object.keys(flags.effects).forEach(key => {
        // Remember Ids
        ids.push(key);

        // Effect already exists  
        if (this.effects[key]) {
          return;
        }
        this.effects[key] = {
          type: flags.effects[key].type,
          fx: new CONFIG.weatherEffects[flags.effects[key].type](this.weather)
        };
        this.effects[key].fx.play();
      });
    }
    // Clean old effects
    if (this.effects) {
      Object.keys(this.effects).forEach(key => {
        if (!ids.includes(key)) {
          this.effects[key].fx.stop();
          delete this.effects[key];
        }
      });
    }
    console.log(this.effects);
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